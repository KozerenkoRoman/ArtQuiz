export default class Error404 {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init() {
        this.createTree()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-error404'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)
    }

    getInnerHTML() {
        return `
            <nav class="navbar navbar-light">
                <a class="navbar-link" href="#/"><h2>Home</h2></a>  
            </nav>
            <header>
               <h1>page not found 404</h1>
            </header>
        `
    }

    destroy() {
        this.article.remove()
    }
}
