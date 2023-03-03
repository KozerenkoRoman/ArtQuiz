class Storage {
    imageList = []
    quizResult = []
    categoriesResult = []

    constructor() {
        this.quizResult = new Array(240).fill(0)
    }

    session = {
        volume: 50,
        volumeMusic: 50,
        switchTime: false,
        switchMusic: false,
        timeToAnswer: 0,
        userName: '',
    }

    init() {
        const sessionObj = JSON.parse(localStorage.getItem('sessionDyson'))
        if (sessionObj) this.session = sessionObj
        let arr = []
        if (localStorage.getItem('quizResultDyson'))
            arr = JSON.parse(localStorage.getItem('quizResultDyson'))
        arr.forEach((item, i) => {
            if (item !== null) this.quizResult[i] = item
        })

        const url = './assets/data/images.json'
        return fetch(url)
            .then((data) => {
                return data.json()
            })
            .then((json) => {
                this.imageList = json
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    getItem(key) {
        return localStorage.getItem(key)
    }

    save() {
        localStorage.setItem('sessionDyson', JSON.stringify(this.session))
        localStorage.setItem('quizResultDyson', JSON.stringify(this.quizResult))
        window.dispatchEvent(new Event('storage'))
    }

    getQuizCategoryScore(id) {
        return (
            this.quizResult.slice(id, id + 10).reduce((sum, current) => {
                return current > 0 ? ++sum : sum
            }, 0) || 0
        )
    }

    getSuccessCategories() {
        let res = 0
        for (let i = 0; i <= 11; i++) {
            if (this.getQuizCategoryScore(i * 10) > 0) res++
        }
        return res
    }

    getTotalScore() {
        return (
            this.quizResult.reduce((sum, current) => {
                return current > 0 ? ++sum : sum
            }, 0) || 0
        )
    }

    destroy() {
        this.save()
    }
}

const storage = new Storage()
export { storage }
