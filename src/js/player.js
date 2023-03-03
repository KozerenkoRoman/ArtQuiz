import { storage } from './storage'
import { playList } from './playlist'

export default class Player {
    #playNum = 0
    #isPlay = false
    #audio = new Audio()

    constructor() {}

    init() {
        this.#audio.addEventListener('ended', this.onTrackEnd.bind(this))
        window.addEventListener('storage', this.storageChange.bind(this))
    }

    destroy() {
        window.removeEventListener('storage', this.storageChange)
        this.#audio.removeEventListener('ended', this.onTrackEnd)
    }

    static playFile(url) {
        if (+storage.session.volume > 0) {
            const audio = new Audio()
            audio.src = url
            audio.volume = +storage.session.volume / 100
            audio.play()
        }
    }

    static playSuccess() {
        this.playFile('./assets/sounds/success.mp3')
    }

    static playWrong() {
        this.playFile('./assets/sounds/wrong.mp3')
    }

    static playEndOfRound() {
        this.playFile('./assets/sounds/end.mp3')
    }

    storageChange() {
        if (storage.session.switchMusic !== this.#isPlay)
            this.toggleAudio(storage.session.switchMusic)
        if (storage.session.volumeMusic / 100 !== this.#audio.volume)
            this.#audio.volume = storage.session.volumeMusic / 100
    }

    play() {
        if (!this.#isPlay) {
            if (!this.#audio.src) this.#audio.src = playList[this.#playNum].src
            this.#audio.currentTime = 0
            this.#audio.play()
            this.#isPlay = true
        }
    }

    toggleAudio(value) {
        if (value) {
            this.play()
        } else {
            this.#audio.pause()
            this.#isPlay = false
        }
    }

    onTrackEnd() {
        if (this.#playNum < playList.length - 1) {
            this.#playNum += 1
        } else {
            this.#playNum = 0
        }
        this.#audio.src = playList[this.#playNum].src
        this.#audio.play()
    }
}
