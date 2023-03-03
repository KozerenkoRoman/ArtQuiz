import { storage } from './storage'
import Message from './message'

export default class Score {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init(id) {
        this.categoryId = +id * 10
        this.createTree()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-score'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)

        this.cardContainer = document.querySelector('.score-cards')
        for (let i = 0; i <= 9; i++) {
            this.addCard(this.categoryId + i)
            const card = document.querySelector(
                '#score-' + (this.categoryId + i)
            )
            card.addEventListener('click', this.cardSelect.bind(this))
        }
    }

    getInnerHTML() {
        const score = storage.getQuizCategoryScore(this.categoryId)
        const link = this.categoryId <= 110 ? 'categories' : 'artists'
        return `
            <nav class="navbar navbar-light">
                <h2>score ${score}/10</h2>
                <a class="navbar-link" href="#/"><h2>Home</h2></a>
                <a class="navbar-link" href="#/${link}/"><h2>${link}</h2></a>
             </nav>
            <div class="score-cards"></div>`
    }

    addCard(id) {
        const passedStyle =
            +storage.quizResult[id] === 1 ? 'item-passed' : 'item-inpassed'
        const iconStyle =
            +storage.quizResult[id] === 1
                ? 'answer-correct'
                : 'answer-incorrect'

        const cardHTML = `
            <div class="score-item-container">
                <div class="score-icon ${iconStyle}"></div>
                <div class="score-item score-item-picture${id} ${passedStyle}" id="score-${id}"></div>
            </div>       
        `
        const card = document.createElement('div')
        this.cardContainer.appendChild(card)
        card.outerHTML = cardHTML
        this.loadPicture(id)
    }

    loadPicture(id) {
        const elemImage = document.querySelector(`#score-${id}`)
        const img = new Image()
        const url = `./assets/gallery/img/${id}.webp`
        img.src = url
        img.onload = () => {
            elemImage.style.backgroundImage = `url("${url}")`
        }
    }

    cardSelect(e) {
        const id = e.target.id.split('-')[1]
        let item = storage.imageList[id]
        item.isCorrect = storage.quizResult[id] === 1
        item.callback = null
        const message = new Message(document.body)
        message.showPictureCompleteMessage(item)
    }

    destroy() {
        for (let i = 0; i <= 9; i++) {
            const card = document.querySelector(
                '#score-' + (i + this.categoryId)
            )
            card.removeEventListener('click', this.cardSelect)
        }
        this.article.remove()
    }
}
