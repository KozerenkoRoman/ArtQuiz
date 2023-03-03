import { storage } from './storage'
import Message from './message'

export default class GlobalScore {
    //https://extendsclass.com/jsonstorage/b1838dc1ff9b URI to access this JSON in a text editor:
    // apiKey = '90b41c29-4d14-11ec-b95c-0242ac110002';
    url = 'https://json.extendsclass.com/bin/b1838dc1ff9b'

    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init() {
        this.createTree()
        this.btnSave = document.querySelector('#btn-save')
        this.btnSave.addEventListener('click', this.saveToGlobal.bind(this))
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-globalscore'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)
        this.requestJSON(this.createScoreList)
    }

    getInnerHTML() {
        return `
            <nav class="navbar navbar-light">
                <h2>Global Score</h2>
                <a class="navbar-link" href="#/"><h2>Home</h2></a>
                <a class="icon settings-icon" href="#/settings"></a>
            </nav>
            <div class="gl-score-container">
                <div class="gl-score-header">User</div><div class="gl-score-header">Score</div>
            </div> 
            <div class="button-settings">
               <button id="btn-save" class="btn" role="button">Save score to global</button>
            </div>            
        `
    }

    createScoreList(arr) {
        const container = document.querySelector('.gl-score-container')
        container.innerHTML =
            '<div class="gl-score-header">User</div><div class="gl-score-header">Score</div>'
        arr.sort((a, b) => +b.score - +a.score).forEach((item) => {
            let elem = document.createElement('div')
            elem.className = 'gl-score-user'
            elem.innerHTML = item.name
            container.appendChild(elem)

            elem = document.createElement('div')
            elem.className = 'gl-score-score'
            elem.innerHTML = item.score
            container.appendChild(elem)
        })
    }

    requestJSON(callback) {
        const request = new XMLHttpRequest()
        request.open('GET', this.url, true)
        request.setRequestHeader('Security-key', '')
        request.onload = () => {
            if (request.status === 200 || request.responseText) {
                callback(JSON.parse(request.responseText))
            }
        }
        request.send()
    }

    saveToGlobal() {
        if (!storage.session.userName) {
            const message = new Message(document.body)
            message.showMessage('Username not specified')
        } else this.requestJSON((arr) => this.updateJSON(arr))
    }

    updateJSON(arr) {
        if (storage.session.userName) {
            const index = arr.findIndex(
                (user) => user.name === storage.session.userName
            )
            if (index > -1) {
                arr[index].score = storage.getTotalScore()
            } else {
                const user = {
                    name: storage.session.userName,
                    score: storage.getTotalScore(),
                }
                arr.push(user)
            }

            const request = new XMLHttpRequest()
            request.open('PUT', this.url, true)
            request.setRequestHeader(
                'Content-type',
                'application/merge-patch+json'
            )
            request.setRequestHeader('Security-key', '')
            request.onreadystatechange = () => this.createScoreList(arr)
            request.send(JSON.stringify(arr))
        }
    }

    destroy() {
        this.btnSave.removeEventListener('click', this.saveToGlobal)
        this.article.remove()
    }
}
