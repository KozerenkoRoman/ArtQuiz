export default class Welcome {
    article

    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init() {
        this.createTree()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-welcome'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)
    }

    getInnerHTML() {
        return `
             <nav class="navbar navbar-light">
                    <a class="icon settings-icon" href="#/settings"></a>
                </nav>

                <header>
                    <h1>art quiz</h1>
                </header>

                <div class="button-container">
                    <a class="btn btn-lg" href="#/artists" role="button">Artists</a>
                    <a class="btn btn-lg" href="#/categories" role="button">Pictures</a>
                    <a class="btn btn-lg" href="#/globalscore" role="button">Global Score</a> 
            </div>`
    }

    destroy() {
        this.article.remove()
    }
}
