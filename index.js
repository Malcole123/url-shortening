const apiBase = 'https://api.shrtco.de/v2/shorten?url=';
var urlInput = document.getElementsByTagName('input')[0];
const searchBtn = document.getElementById('submit');
var searchParam = ''

var menuToggle = document.getElementById('menuToggle')
var navLinks = document.getElementsByClassName('nav-links')[0];
var mobilenavOpen = false;


function getInput(){//check if input is empty
    searchParam = urlInput.value.replaceAll(" ",'');
    if(searchParam.length > 0){
        getResponse();
        urlInput.setAttribute('placeholder', 'Shorten your URL here...')

    }else{
        urlInput.style.border = "3px solid hsl(0, 87%, 67%)"
        urlInput.setAttribute('placeholder', 'Please Enter a valid URL...')
    }    
}

function getResponse(){
    fetch(apiBase+searchParam , {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => 
        createResults(searchParam,data.result.short_link))
            .catch(error =>{
                alert('Please enter a valid URL. ' +'Error message:' + error.message);
                urlInput.style.border = "3px solid hsl(0, 87%, 67%)"
                urlInput.setAttribute('placeholder', 'Please Enter a valid URL...')
            } )

    urlInput.value = ""
}

function createResults(userLink,linkshort1){
    var setLinks = userLink
    var setShorts = linkshort1

        var resultCard = document.createElement('div');
        resultCard.className= "result-card"
        var placeLink = document.createElement('p');
        placeLink.innerHTML = setLinks;
    
        resultCard.appendChild(placeLink);
    
        var shortLink = document.createElement('a');
        shortLink.id='shortenedLink';
        shortLink.innerHTML = setShorts;
    
        resultCard.appendChild(shortLink)
    
        var copyBtn = document.createElement('button')
        copyBtn.className= 'copyState';
        copyBtn.innerHTML = 'Copy';
        copyBtn.addEventListener('click', copyText)
    
        resultCard.appendChild(copyBtn);
        var resultsP = document.getElementsByClassName('search-results')[0];
        resultsP.appendChild(resultCard)

        localStorage.setItem(setLinks,setShorts)    
    optimizeLayout()
}

function optimizeLayout(){
    var resultsArea = document.getElementsByClassName('search-results')[0];
    var currentResults = resultsArea.children;
    var infoSect = document.getElementsByClassName('stats-info')[0]
    var  contentBelow = document.getElementsByClassName('stats-info')[0].getElementsByTagName('h2')[0]
    if(currentResults.length >= 1 ){
        if(window.offsetWidth > 800){
            contentBelow.style.marginTop = "200px"
        }else{
            contentBelow.style.marginTop = "20px"
            infoSect.style.height = "180vh";
        }
        if(currentResults.length >= 2){
            resultsArea.style.overflowY = "scroll"
        }else{
            resultsArea.style.overflowY = "hidden"
        }
    }

}
// checks input during typing
function checkValid(){
    var check = urlInput.value;
    if(check.search('https') > -1 ){
        urlInput.style.border = "none"
        urlInput.setAttribute('placeholder', 'Shorten your URL here...')
    }else if(check.search('www') > -1 ){
        urlInput.style.border = "none"
        urlInput.setAttribute('placeholder', 'Shorten your URL here...')

    }else if(check.search('.com') > -1){
        urlInput.style.border = "none"
        urlInput.setAttribute('placeholder', 'Shorten your URL here...')
    }
    else{
        urlInput.style.border = "3px solid hsl(0, 87%, 67%)"
        urlInput.setAttribute('placeholder', 'Please Enter a valid URL...') 
    }

}

function empty(){
    urlInput.style.border = "none"
    urlInput.setAttribute('placeholder', 'Shorten your URL here...')
}

function copyText(){
    var text2copy = event.currentTarget.parentNode.children[1].innerHTML;
    navigator.clipboard.writeText(text2copy)
    event.currentTarget.innerHTML = "Copied !"
    event.currentTarget.style.backgroundColor = "#333"
}
// gets previous user data start
function loadFromLocal(){
    var keys = Object.keys(localStorage); //Gets long url from local storage
    var values = Object.values(localStorage) // Gets short url from local storage
    
    for(let i = 0; i < keys.length; i++){
        var objVal = localStorage.getItem(keys[i]);
        createResults(keys[i],objVal)
    }
    optimizeLayout()
}
//gets previous user data end

//menu controls start
function toggleMenu(){
    if(mobilenavOpen === false){
        navLinks.style.top = "80px";
        mobilenavOpen = true;
    }else{
        navLinks.style.top = "-475px"
        mobilenavOpen = false
    }
}
function closeonScroll(){
    if(mobilenavOpen === true && window.scrollY > 0){
        navLinks.style.top = "-475px"
        mobilenavOpen = false
    }
}
//menu controls end




//Changes color after error input and user starts typing again
urlInput.addEventListener('keyup', checkValid);
//Changes color on blur
urlInput.addEventListener('blur', empty)

//Triggers api call if input is valid
searchBtn.addEventListener('click', getInput)

window.addEventListener('load',loadFromLocal)
window.addEventListener('scroll', closeonScroll)

menuToggle.addEventListener('click',toggleMenu)