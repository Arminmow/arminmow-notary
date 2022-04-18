function loadBook (filename, displayName){
    let currentBook = '';

    // Reset ui
    document.getElementById('fileName').innerHTML = displayName
    document.getElementById('fileContent').innerText = 'Loading...'
    document.getElementById('searchStat').innerHTML = '';
    document.getElementById('keyWord').value = '';
    document.getElementById('mostUsed').innerHTML = ''
    document.getElementById('leastUsed').innerHTML = ''

    // fetch the book
    fetch('books/' + filename)
        .then(res=>res.text())
        .then(json=> {

            currentBook = json;
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>')
            getDocStats(json)
            document.getElementById('fileContent').innerHTML = currentBook
            console.log("tamam")
        })
}

function getDocStats (content){
    let txt = content.toLowerCase()
    let wordArray = txt.match(/\b\S+\b/g)
    let dictionary = {}

    wordArray = filterStopWords(wordArray)

    for (let word in wordArray){
        if(dictionary[wordArray[word]] > 0){
            dictionary[wordArray[word]] += 1
        }else {
            dictionary[wordArray[word]] = 1;
        }
    }
    let wordList = sortProperty(dictionary)

    let top5 = wordList.slice(0,5)

    let least5 = wordList.slice(-5, wordList.length+1)

    showStats(top5, document.getElementById('mostUsed'))
    showStats(least5, document.getElementById('leastUsed'))
}

function showStats (arr, elem){
    arr.forEach((pair)=>{
        let word = pair[0]
        let count = pair[1]
        const liElement = document.createElement('li')
        liElement.innerText = `${word} : ${count} time(s)`
       elem.appendChild(liElement)
    })
}

function sortProperty (obj){
    //convert obj to array
    let rtnArray = Object.entries(obj);

    //sort the array
    rtnArray.sort(function (a,b){
        return b[1] - a[1]
    })
    return rtnArray
}

function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

function filterStopWords (wordArray){
    let noiseWords = getStopWords()
    return wordArray.filter(word => !noiseWords.includes(word))
}

function highlightWord (){
    let keyword = document.getElementById('keyWord').value
    let display = document.getElementById('fileContent')
    let newContent ;

    let spans = document.querySelectorAll('span')

    for (let i=0; i < spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML
    }

    let reg = new RegExp(keyword, 'gi')
    let bookContent = display.innerHTML
    let replaceText = '<span id="mark">$&</span>'

    newContent = bookContent.replace(reg, replaceText)

    display.innerHTML = newContent
    let count = document.querySelectorAll('span').length
    document.getElementById('searchStat').innerHTML = `found ${count} matches`

    if (count > 0){
        document.querySelector('span').scrollIntoView()
    }
}
