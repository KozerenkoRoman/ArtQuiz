import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/toggle.css'
import '../css/style.css'
import '../css/cards.css'
import '../css/pictures.css'
import '../css/message.css'
import '../css/score.css'
import '../css/painter.css'
import Artists from './artists'
import Error404 from './error404'
import Pictures from './pictures'
import Player from './player'
import Settings from './settings'
import Utils from './utils'
import Welcome from './welcome'
import Categories from './categories'
import Score from './score'
import Painter from './painter'
import GlobalScore from './globalscore'
import { storage } from './storage'

class MainApp {
    constructor() {
        this.content = document.getElementById('content')
        this.player = new Player()
    }

    init() {
        window.addEventListener('hashchange', this.router.bind(this))
        window.addEventListener('load', this.router.bind(this))
        window.addEventListener('beforeunload', this.destroy.bind(this))
        storage.init().then(() => {
            this.player.init()
        })
        this.btnFullScr = document.querySelector('#button-fullscreen')
        this.btnFullScr.addEventListener(
            'click',
            this.toggleFullScreen.bind(this)
        )
    }

    getFullscreenElement() {
        return (
            document.fullscreenElementn ||
            document.webkitFullscreenElement ||
            document.mozFullscreenElement
        )
    }

    toggleFullScreen() {
        if (this.getFullscreenElement()) {
            this.btnFullScr.classList.remove('exitfullscreen-icon')
            this.btnFullScr.classList.add('fullscreen-icon')
            document.exitFullscreen()
        } else {
            this.btnFullScr.classList.add('exitfullscreen-icon')
            this.btnFullScr.classList.remove('fullscreen-icon')
            document.body.requestFullscreen()
        }
    }

    destroy() {
        this.player.destroy()
        this.imageList.destroy()
        storage.destroy()
    }

    routes = {
        '/': Welcome,
        '/artists': Artists,
        '/categories': Categories,
        '/pictures': Pictures,
        '/score': Score,
        '/globalscore': GlobalScore,
        '/settings': Settings,
        '/painter': Painter,
    }

    router() {
        if (this.currentPage) {
            this.currentPage.destroy()
        }
        const request = Utils.parseRequestURL()
        const parsedURL = request.resource ? '/' + request.resource : '/'
        this.currentPage = new (
            this.routes[parsedURL] ? this.routes[parsedURL] : Error404
        )(this.content)
        this.currentPage.init(request.id)
    }
}

const mainApp = new MainApp()
mainApp.init()
