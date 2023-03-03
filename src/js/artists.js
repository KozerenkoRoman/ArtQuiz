import {storage} from './storage'

export default class Artists {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init() {
        this.createTree()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-categories'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)

        this.cardContainer = document.querySelector('.categories-cards')
        for (let i = 12; i <= 23; i++) {
            this.addCard(i)
            const card = document.querySelector('.item-picture' + i * 10)
            card.addEventListener('click', this.cardSelect.bind(this))
        }
    }

    getInnerHTML() {
        return `
            <nav class="navbar navbar-light">
                <h2>artists</h2>
                <a class="navbar-link" href="#/"><h2>Home</h2></a>
                <a class="icon settings-icon" href="#/settings"></a>
            </nav>
            <div class="categories-cards"></div>`
    }

    addCard(num) {
        const id = num * 10
        const style = document.createElement('style')
        style.innerHTML = `.item-picture${id} {background: url("./assets/gallery/full/${id}.webp") top/cover;}`
        document.getElementsByTagName('head')[0].appendChild(style)

        const score = storage.getQuizCategoryScore(num * 10)
        const styleItem = score > 0 ? 'item-passed' : ''
        let scoreDiv = ''
        if (score > 0) {
            scoreDiv = `<a class="item-bottom" href="#/score/${num}"><div class="icon star-icon"></div></a>`
        }
        const cardHTML = `
            <div class="categories-item" id="categories-${id}">
                <div class="item-header">
                    <div class="item-title">Part ${num - 11}</div>
                    <div class="item-counter" id="item-counter${id}">${score}/10</div>
                </div>
                <div class="item-category item-picture${id} ${styleItem}" id="card-${id}">
                    ${scoreDiv}
                </div>
            </div>        
        `
        const card = document.createElement('div')
        this.cardContainer.appendChild(card)
        card.outerHTML = cardHTML
    }

    cardSelect(e) {
        const id = e.target.id.split('-')[1]
        location.href = `#/painter/${id}`
    }

    destroy() {
        for (let i = 12; i <= 23; i++) {
            const card = document.querySelector('.item-picture' + i * 10)
            card.removeEventListener('click', this.cardSelect)
        }
        this.article.remove()
    }
}
