import { storage } from './storage'
import Utils from './utils'
import Message from './message'

export default class Painter {
    arrAnswer = []
    rightButton = Element

    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init(id) {
        this.oldScore = storage.getQuizCategoryScore(+id)
        this.categoryId = +id
        this.current = +id
        this.createTree()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-painter'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)
        this.progressTime = document.querySelector('.current-time')
        this.progress = document.querySelector('.progress')
        this.bar = document.querySelector('#bar')
        this.image = document.querySelector('.picture-img')
        this.btnClose = document.querySelector('#btn-close')
        this.btnAnswer1 = document.querySelector('#answer1')
        this.btnAnswer2 = document.querySelector('#answer2')
        this.btnAnswer3 = document.querySelector('#answer3')
        this.btnAnswer4 = document.querySelector('#answer4')
        this.btnClose.addEventListener('click', this.onClose.bind(this))
        this.btnAnswer1.addEventListener('click', this.answerClick.bind(this))
        this.btnAnswer2.addEventListener('click', this.answerClick.bind(this))
        this.btnAnswer3.addEventListener('click', this.answerClick.bind(this))
        this.btnAnswer4.addEventListener('click', this.answerClick.bind(this))

        document
            .querySelectorAll('.download-img')
            .forEach((elem) =>
                elem.addEventListener('click', this.downloadClick.bind(this))
            )

        this.addPaginationItems()
        this.addPainterCaption()
        this.createTimer()
    }

    getInnerHTML() {
        return `
            <div class="picture-timer-container">
                <button id="btn-close" class="icon close-icon picture-icon"></button>
                <div class="progress" id="progress">
                    <div id="bar"></div>
                </div>
                <div class="current-time">00:00</div>
            </div>
            <div class="picture-container">
                <div class="picture-question"></div>
                <div class="painter-answers-container">
                    <div id="answer1" class="painter-img"><a class="download-img icon"></a></div>
                    <div id="answer2" class="painter-img"><a class="download-img icon"></a></div>
                    <div id="answer3" class="painter-img"><a class="download-img icon"></a></div>
                    <div id="answer4" class="painter-img"><a class="download-img icon"></a></div>
                </div>
            </div>
            <div class="painter-pagination-container">
                <div class="picture-pagination"></div> 
            </div>`
    }

    addPaginationItems() {
        const parentNode = document.querySelector('.picture-pagination')
        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div')
            item.id = 'pag' + (this.categoryId + i)
            parentNode.appendChild(item)
            this.setPaginationClass(this.categoryId + i)
        }
    }

    setPaginationClass(id) {
        const res = +storage.quizResult[id]
        const item = document.querySelector('#pag' + id)
        item.className = 'pagination-item'
        if (res === 1) item.classList.add('item-correct')
        if (res === -1) item.classList.add('item-wrong')
    }

    answerClick(e) {
        clearInterval(this.timerId)
        let isCorrect = false
        if (e !== undefined) {
            if (e.target === this.rightButton) {
                e.target.classList.add('item-correct')
                storage.quizResult[this.current] = 1
                isCorrect = true
            } else {
                e.target.classList.add('item-wrong')
                storage.quizResult[this.current] = -1
            }
        }
        this.setPaginationClass(this.current)
        if (this.current < this.categoryId + 10) {
            let item = {
                author: '',
                name: '',
                year: '',
                imageNum: 0,
                isCorrect: false,
            }
            item = storage.imageList[this.current]
            item.isCorrect = isCorrect
            item.callback = this.showNextAnswer.bind(this)
            const message = new Message(document.body)
            message.showPictureCompleteMessage(item)
        }
    }

    showNextAnswer() {
        this.current++
        if (this.current < this.categoryId + 10) {
            this.addPainterCaption()
        } else {
            storage.save()
            const message = new Message(document.body)
            message.showLevelCompleteMessage(
                this.categoryId,
                this.oldScore,
                'painter'
            )
        }
        this.createTimer()
    }

    getArrAnswer() {
        let arr = []
        const painters = new Set()
        do {
            painters.clear()
            arr = Utils.randomArray(3, 0, 240)
            arr.push(this.current)
            arr.forEach((item) => painters.add(storage.imageList[item].author))
        } while (painters.size !== arr.length)
        return Utils.shuffle(arr)
    }

    downloadClick(e) {
        e.stopPropagation()
        // e.target.href = '/#';
    }

    fillHref(element, item) {
        element.href = `./assets/gallery/full/${item.imageNum}.webp`
        element.download = `${item.author}-${item.name}.webp`
    }

    addPainterCaption() {
        this.arrAnswer = this.getArrAnswer()

        const title = document.querySelector('.picture-question')
        title.innerHTML = `Which is ${
            storage.imageList[this.current].author
        } picture?`

        let item = {
            author: '',
            name: '',
            year: '',
            imageNum: 0,
            isCorrect: false,
        }
        item = storage.imageList[this.arrAnswer[0]]
        if (+item.imageNum === this.current) this.rightButton = this.btnAnswer1
        this.btnAnswer1.className = 'painter-img'
        this.fillHref(this.btnAnswer1.getElementsByTagName('a')[0], item)
        this.loadPicture(
            `./assets/gallery/img/${item.imageNum}.webp`,
            this.btnAnswer1
        )

        item = storage.imageList[this.arrAnswer[1]]
        if (+item.imageNum === this.current) this.rightButton = this.btnAnswer2
        this.btnAnswer2.className = 'painter-img'
        this.fillHref(this.btnAnswer2.getElementsByTagName('a')[0], item)
        this.loadPicture(
            `./assets/gallery/img/${item.imageNum}.webp`,
            this.btnAnswer2
        )

        item = storage.imageList[this.arrAnswer[2]]
        if (+item.imageNum === this.current) this.rightButton = this.btnAnswer3
        this.btnAnswer3.className = 'painter-img'
        this.fillHref(this.btnAnswer3.getElementsByTagName('a')[0], item)
        this.loadPicture(
            `./assets/gallery/img/${item.imageNum}.webp`,
            this.btnAnswer3
        )

        item = storage.imageList[this.arrAnswer[3]]
        if (+item.imageNum === this.current) this.rightButton = this.btnAnswer4
        this.btnAnswer4.className = 'painter-img'
        this.fillHref(this.btnAnswer4.getElementsByTagName('a')[0], item)
        this.loadPicture(
            `./assets/gallery/img/${item.imageNum}.webp`,
            this.btnAnswer4
        )
    }

    loadPicture(url, elem) {
        const img = new Image()
        img.src = url
        img.onload = () => {
            elem.style.backgroundImage = `url("${url}")`
        }
    }

    createTimer() {
        if (storage.session.switchTime) {
            this.progressTime.innerHTML = Utils.formatSeconds(0)
            this.bar.style.width = '0'

            let current = 1
            this.timerId = setInterval(() => {
                this.bar.style.width =
                    Math.ceil((100 / +storage.session.timeToAnswer) * current) +
                    '%'
                this.progressTime.innerHTML = Utils.formatSeconds(current)
                if (current === +storage.session.timeToAnswer) {
                    this.answerClick()
                    clearInterval(this.timerId)
                }
                current++
            }, 1000)
        } else {
            this.progressTime.style.display = 'none'
            this.progress.style.display = 'none'
        }
    }

    onClose() {
        const message = new Message(document.body)
        message.showQuestion(
            'Do you really want to quit the game?',
            this.categoryId
        )
    }

    destroy() {
        this.btnClose.removeEventListener('click', this.onClose)
        this.btnAnswer1.removeEventListener('click', this.answerClick)
        this.btnAnswer2.removeEventListener('click', this.answerClick)
        this.btnAnswer3.removeEventListener('click', this.answerClick)
        this.btnAnswer4.removeEventListener('click', this.answerClick)
        document
            .querySelectorAll('.download-img')
            .forEach((elem) =>
                elem.removeEventListener('click', this.downloadClick)
            )
        clearInterval(this.timerId)
        this.article.remove()
    }
}
