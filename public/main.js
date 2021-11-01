var next = document.getElementsByClassName('status')
var clearAll = document.getElementById('clearAll')
var allItems = document.getElementsByClassName('order')

Array.from(next).forEach(function(element) {
    element.addEventListener('click',  function(){
        const barista = document.getElementById('barista').innerText
        const status = this.innerText
        const customer = this.parentNode.parentNode.childNodes[1].childNodes[1].innerText
        const id = this.parentNode.parentNode.childNodes[1].childNodes[3].innerText
        const item = this.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1].innerText
        const sugar = this.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[1].innerText
        const cream = this.parentNode.parentNode.childNodes[3].childNodes[5].childNodes[1].innerText
        const half = this.parentNode.parentNode.childNodes[3].childNodes[7].childNodes[1].innerText
        fetch('/', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'customer': customer,
            'id': id,
            'item': item,
            'cream': cream,
            'half': half,
            'sugar': sugar,
            'status': status,
            'barista': barista
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


