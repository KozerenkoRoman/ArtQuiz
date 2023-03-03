import { storage } from './storage'
import Player from './player'

export default class Message {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    showMessage(message) {
        this.createMessageTree(message)
        this.modalContent = document.querySelector('.modal-content')
        this.btnCancel = document.querySelector('#btn-no')
        this.btnCancel.addEventListener('click', this.cancelClick.bind(this))
        this.createGlobalListeners()
    }

    showQuestion(message, categoryId) {
        this.categoryId = +categoryId
        this.createQuestionTree(message)
        this.modalContent = document.querySelector('.modal-content')
        this.btnCancel = document.querySelector('#btn-no')
        this.btnOk = document.querySelector('#btn-yes')
        this.btnCancel.addEventListener('click', this.cancelClick.bind(this))
        this.btnOk.addEventListener('click', this.homeClick.bind(this))
        this.createGlobalListeners()
    }

    showLevelCompleteMessage(categoryId, oldScore, link) {
        this.categoryId = +categoryId
        this.link = link
        const newScore = storage.getQuizCategoryScore(this.categoryId)
        this.createLevelCompleteTree(newScore, oldScore)
        this.modalContent = document.querySelector('.modal-content')
        this.btnOk = document.querySelector('#btn-yes')
        this.btnNext = document.querySelector('#btn-next')
        this.btnOk.addEventListener('click', this.homeClick.bind(this))
        this.btnNext.addEventListener('click', this.nextQuizClick.bind(this))
        this.createGlobalListeners()
        if (this.categoryId === 230 || this.categoryId === 110)
            this.btnNext.innerText = 'End of the game!'
    }

    showPictureCompleteMessage(item) {
        item.isCorrect ? Player.playSuccess() : Player.playWrong()
        this.createPictureCompleteTree(item)
        this.modalContent = document.querySelector('.modal-content')
        this.btnCancel = document.querySelector('#btn-no')
        this.btnCancel.addEventListener('click', this.cancelClick.bind(this))
        this.createGlobalListeners()
    }

    createGlobalListeners() {
        this.modalContent.addEventListener(
            'mousedown',
            this.onMouseDown.bind(this),
            true
        )
        window.addEventListener('click', this.hideMessage.bind(this))
        document.addEventListener('mouseup', this.onMouseUp.bind(this), true)
        document.addEventListener(
            'mousemove',
            this.onMouseMove.bind(this),
            true
        )
    }

    createMessageTree(message) {
        const html = `
            <div class="modal">
                <div class="modal-content">
                    <div class="txt-message">
                        ${message}
                    </div>
                    <button id="btn-no" class="btn btn-message">Ok</button>
                </div>
            </div>`

        this.modal = document.createElement('div')
        this.parentNode.appendChild(this.modal)
        this.modal.outerHTML = html
    }

    createQuestionTree(message) {
        const html = `
            <div class="modal">
                <div class="modal-content">
                    <div class="txt-message">
                        ${message}
                    </div>
                    <div class="picture-answers-container">
                        <button id="btn-yes" class="btn btn-message">Yes</button>
                        <button id="btn-no" class="btn btn-message">No</button>
                    </div>
                </div>
            </div>`

        this.modal = document.createElement('div')
        this.parentNode.appendChild(this.modal)
        this.modal.outerHTML = html
    }

    createLevelCompleteTree(newScore, oldScore) {
        let html = ''
        if (newScore === 10) {
            html = `
                <div class="modal">
                    <div class="modal-content">
                        <div class="txt-message-img">
                            <div class="stars-champion shimmer"></div>                        
                            <h2>Grand result!</h2>
                        </div>
                        <div class="picture-answers-container">
                            <button id="btn-next" class="btn btn-message">Next Quiz</button>
                            <button id="btn-yes" class="btn btn-message">Home</button>
                        </div>
                    </div>
                </div>`
        } else if (newScore > oldScore) {
            html = `
                <div class="modal">
                    <div class="modal-content">
                        <div class="txt-message-img">
                            <h2>Congratulations!</h2>
                            <div class="cup-champion shimmer"></div>
                            <div class="txt-message">${newScore}/10</div>
                        </div>
                        <div class="picture-answers-container">
                            <button id="btn-next" class="btn btn-message">Next Quiz</button>
                            <button id="btn-yes" class="btn btn-message">Home</button>
                        </div>
                    </div>
                </div>`
        } else {
            html = `
                <div class="modal">
                    <div class="modal-content">
                        <div class="txt-message-img">
                            <h2>Your result may be better!</h2>
                            <div class="cup-broken shimmer"></div>
                            <div class="txt-message">${newScore}/10</div>
                        </div>
                        <div class="picture-answers-container">
                            <button id="btn-next" class="btn btn-message">Next Quiz</button>
                            <button id="btn-yes" class="btn btn-message">Home</button>
                        </div>
                    </div>
                </div>`
        }

        this.modal = document.createElement('div')
        this.parentNode.appendChild(this.modal)
        this.modal.outerHTML = html
        Player.playEndOfRound()
    }

    createPictureCompleteTree(item) {
        const iconStyle = item.isCorrect ? 'answer-correct' : 'answer-incorrect'
        const html = `
            <div class="modal">
                <div class="modal-content">
                    <div class="small-message-img">
                        <img class="small-img">
                            <div class="small-txt-message">
                                <div></div><div class="icon ${iconStyle}"></div>
                                <div class="small-txt-desc">author</div><div>${item.author}</div>
                                <div class="small-txt-desc">name</div><div>${item.name}</div>
                                <div class="small-txt-desc">year</div><div>${item.year}</div>
                            </div>
                    </div>
                    <button id="btn-no" class="btn btn-message">Ok</button>
                </div>
            </div>`
        this.modal = document.createElement('div')
        this.parentNode.appendChild(this.modal)
        this.modal.outerHTML = html
        this.loadPicture(`./assets/gallery/img/${item.imageNum}.webp`)
        this.callback = item.callback
    }

    loadPicture(url) {
        const elemImage = document.querySelector('.small-img')
        const img = new Image()
        img.src = url
        img.onload = () => {
            elemImage.style.backgroundImage = `url("${url}")`
        }
    }

    onMouseDown(e) {
        this.isDown = true
        this.offset = [
            this.modal.offsetLeft - e.clientX,
            this.modal.offsetTop - e.clientY,
        ]
    }

    onMouseUp() {
        this.isDown = false
    }

    onMouseMove(e) {
        e.preventDefault()
        if (this.isDown) {
            this.modalContent.style.left = e.clientX + this.offset[0] + 'px'
            this.modalContent.style.top = e.clientY + this.offset[1] + 'px'
        }
    }

    hideMessage(e) {
        if (e.target === this.modal) {
            this.destroy()
        }
    }

    homeClick() {
        this.destroy()
        location.href = this.categoryId < 120 ? '#/categories' : '#/artists'
    }

    cancelClick() {
        if (this.callback) this.callback()
        this.destroy()
    }

    nextQuizClick() {
        this.destroy()
        if (this.categoryId === 230 || this.categoryId === 110)
            location.href = this.categoryId < 120 ? '#/categories' : '#/artists'
        else location.href = `#/${this.link}/${this.categoryId + 10}`
    }

    destroy() {
        window.removeEventListener('click', this.hideMessage)
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
        if (this.btnOk) this.btnOk.removeEventListener('click', this.homeClick)
        if (this.btnCancel)
            this.btnCancel.removeEventListener('click', this.cancelClick)
        if (this.btnNext)
            this.btnNext.removeEventListener('click', this.nextQuizClick)
        this.modal = document.querySelector('.modal')
        this.modalContent.removeEventListener('mousedown', this.onMouseDown)
        this.modal.remove()
    }
}
