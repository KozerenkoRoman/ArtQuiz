import { storage } from './storage'

export default class Settings {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    init() {
        this.createTree()
        this.btnClose = document.querySelector('#btn-close')
        this.btnMusicOff = document.querySelector('#music-off')
        this.btnMusicOn = document.querySelector('#music-on')
        this.btnSaveSession = document.querySelector('#btn-save')
        this.btnTimeMinus = document.querySelector('#time-minus')
        this.btnTimePlus = document.querySelector('#time-plus')
        this.btnVolumeOff = document.querySelector('#volume-off')
        this.btnVolumeOn = document.querySelector('#volume-on')
        this.cbSwitchMusic = document.querySelector('#switch-music')
        this.cbSwitchTime = document.querySelector('#switch-time')
        this.timeToAnswer = document.querySelector('.quantity-num')
        this.userName = document.querySelector('.user-name')
        this.volume = document.querySelector('#progress-volume')
        this.volumeMusic = document.querySelector('#music-volume')

        this.btnClose.addEventListener('click', this.goBack.bind(this))
        this.btnMusicOff.addEventListener('click', this.setVolume.bind(this))
        this.btnMusicOn.addEventListener('click', this.setVolume.bind(this))
        this.btnSaveSession.addEventListener(
            'click',
            this.saveToStorage.bind(this)
        )
        this.btnTimeMinus.addEventListener(
            'click',
            this.setTimeValue.bind(this)
        )
        this.btnTimePlus.addEventListener('click', this.setTimeValue.bind(this))
        this.btnVolumeOff.addEventListener('click', this.setVolume.bind(this))
        this.btnVolumeOn.addEventListener('click', this.setVolume.bind(this))
        this.cbSwitchMusic.addEventListener(
            'click',
            this.toggleMusic.bind(this)
        )
        this.cbSwitchTime.addEventListener('click', this.toggleTime.bind(this))
        this.volume.addEventListener('input', this.volumeValueChange.bind(this))
        this.volumeMusic.addEventListener(
            'input',
            this.volumeMusicValueChange.bind(this)
        )
        this.restoreFromStorage()
    }

    destroy() {
        this.btnClose.removeEventListener('click', this.goBack)
        this.btnMusicOff.removeEventListener('click', this.setVolume)
        this.btnMusicOn.removeEventListener('click', this.setVolume)
        this.btnSaveSession.removeEventListener('click', this.saveToStorage)
        this.btnTimeMinus.removeEventListener('click', this.setTimeValue)
        this.btnTimePlus.removeEventListener('click', this.setTimeValue)
        this.btnVolumeOff.removeEventListener('click', this.setVolume)
        this.btnVolumeOn.removeEventListener('click', this.setVolume)
        this.cbSwitchMusic.removeEventListener('click', this.toggleMusic)
        this.cbSwitchTime.removeEventListener('click', this.toggleTime)
        this.volume.removeEventListener('input', this.volumeValueChange)
        this.volumeMusic.removeEventListener(
            'input',
            this.volumeMusicValueChange
        )
        this.article.remove()
    }

    createTree() {
        this.article = document.createElement('article')
        this.article.className = 'article-settings'
        this.article.innerHTML = this.getInnerHTML()
        this.parentNode.appendChild(this.article)
    }

    getInnerHTML() {
        return `
    <nav class="navbar navbar-light">
        <h2>settings</h2>
        <button id="btn-close" class="icon close-icon btn-lg"></button>
    </nav>
    <div class="settings-param-container">
        <div class="settings-param">
            <h3>Volume</h3>
            <div class="settings-item">
                <button id="volume-off" class="icon mute-icon"></button>
                <input type="range" id="progress-volume" value="50">
                <button id="volume-on" class="icon volume-icon"></button>
            </div>

            <h3>background music</h3>
            <div class="settings-item">
                <div class="settings-item">
                    <button id="music-off" class="icon mute-icon"></button>
                    <input id="music-volume" type="range"  value="50">
                    <button id="music-on" class="icon volume-icon"></button>
                </div>
                <label class="switch-caption" id="switch-caption-music">off</label>
                <label class="switch">
                    <input id="switch-music" type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
        </div>

        <div class="settings-param">
            <h3>Time game</h3>
            <div class="settings-item">
                <label class="switch-caption" id="switch-caption-time">off</label>
                <label class="switch">
                    <input id="switch-time" type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
            <h3>Time to answer</h3>
            <div class="settings-item">
                <button id="time-minus" class="icon minus-icon"></button>
                <input class="quantity-num" type="number" min="5" max="30" step="5" value="0" readonly/>
                <button id="time-plus" class="icon plus-icon"></button>
            </div>
        </div>

        <div class="settings-param">
            <h3>User name</h3>
            <div class="settings-item">
                <input class="user-name" type="text"/>
            </div>
        </div>
    </div>
    <div class="button-container button-settings">
        <button id="btn-save" class="btn btn-lg" role="button">Save</button>
    </div>
`
    }

    volumeValueChange() {
        this.inputValueChange(this.volume)
    }

    volumeMusicValueChange() {
        this.inputValueChange(this.volumeMusic)
    }

    inputValueChange(element) {
        element.style.background = `linear-gradient(to right, var(--bs-yellow) ${element.value}%, white ${element.value}%, white 100%)`
    }

    setVolume(e) {
        let element
        if (e.target === this.btnVolumeOn || e.target === this.btnVolumeOff)
            element = this.volume
        if (e.target === this.btnMusicOn || e.target === this.btnMusicOff)
            element = this.volumeMusic

        if (e.target === this.btnVolumeOn || e.target === this.btnMusicOn)
            element.value = 100
        if (e.target === this.btnVolumeOff || e.target === this.btnMusicOff)
            element.value = 0
        this.inputValueChange(element)
    }

    setTimeValue(e) {
        if (e.target === this.btnTimePlus) {
            this.timeToAnswer.value =
                +this.timeToAnswer.value < 30
                    ? +this.timeToAnswer.value + 5
                    : 30
            this.timeToAnswer.innerText = this.timeToAnswer.value
        } else if (e.target === this.btnTimeMinus) {
            this.timeToAnswer.value =
                +this.timeToAnswer.value > 0 ? +this.timeToAnswer.value - 5 : 0
            this.timeToAnswer.innerText = this.timeToAnswer.value
        }
    }

    toggleTime(e) {
        const sender = !e ? this.cbSwitchTime : e.target
        const label = document.querySelector('#switch-caption-time')
        label.innerText = sender.checked ? 'on' : 'off'
    }

    toggleMusic(e) {
        const sender = !e ? this.cbSwitchMusic : e.target
        const label = document.querySelector('#switch-caption-music')
        label.innerText = sender.checked ? 'on' : 'off'
    }

    saveToStorage() {
        storage.session.volume = this.volume.value
        storage.session.volumeMusic = this.volumeMusic.value
        storage.session.switchTime = this.cbSwitchTime.checked
        storage.session.switchMusic = this.cbSwitchMusic.checked
        storage.session.timeToAnswer = this.timeToAnswer.value
        storage.session.userName = this.userName.value
        storage.save()
    }

    restoreFromStorage() {
        this.volume.value = storage.session.volume
        this.cbSwitchTime.checked = storage.session.switchTime
        this.cbSwitchMusic.checked = storage.session.switchMusic
        this.volumeMusic.value = storage.session.volumeMusic
        this.timeToAnswer.value = storage.session.timeToAnswer
        this.userName.value = storage.session.userName
        this.toggleTime()
        this.toggleMusic()
        this.volumeValueChange()
        this.volumeMusicValueChange()
    }

    goBack() {
        window.history.length > 0
            ? window.history.back()
            : (location.href = '/')
    }
}
