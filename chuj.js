document.getElementById("coinButton").addEventListener("click", function(event){
  event.preventDefault()
  let value = document.getElementById("coin").value
  console.log(value)
  showCurrency(value)
});
document.getElementById("stonkButton").addEventListener("click", function(event){
  event.preventDefault()
  let value = document.getElementById("stonk").value
  console.log(value)
  showStonk(value, "long")
});





function porada(){
  console.log("click")
  let random = Math.random()
  let generator = document.querySelector(".generator")
  random>0.5 ?  document.querySelector(".generator").innerHTML="SPRZEDAJ" : generator.innerHTML="KUPUJ"
  generator.style.color = random>0.5 ? "red" :"greenyellow"
  setTimeout(() => {
    generator.innerHTML="Generator liczb losowych "
    generator.style.color="white"
  }, 1000);

}


let dzisiejsze = document.querySelector(".dzisiejsze")

let observedStonk = ["AMZN", "TSLA", "COIN", "MSTR", "META","MCD"]
observedStonk.forEach(element => {
  document.querySelector(".buttons").innerHTML+=`<button onclick="showStonk('${element}', 'long')">${element} </button>
  `
});



function showCurrency(currency){
  document.getElementById("buttonstore").innerHTML=""
    let Coinprices = []

document.getElementById("canvasStore").innerHTML=""
let canvas = document.createElement("canvas")
canvas.setAttribute("id", "line-chart")
document.getElementById("canvasStore").appendChild(canvas)





fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
  .then((response) => response.json())
  .then((data) => data.filter(element=>element.id==currency).map(element=>
    dzisiejsze.innerHTML=`<div>
    <div class="whole">Cena teraz: <p>${element.current_price} USD</p></div> 
    <div class="whole">Zmiana dziś: <p class="dupa">${element.price_change_percentage_24h} %</p></div>
</div>`

    ));

fetch(`https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=usd&days=300&interval=monthly`)
  .then((response) => response.json())
  .then((data) => data.prices.map(price=>Coinprices.push(price[1])))
  .then(()=>makeGraph());

console.log((Coinprices))
console.log([1,2,3,2,2,2])

let bottom=[]
for (let index = 0; index < 300; index++) {
    bottom.push(index);
    
}



function makeGraph() {
  if(parseInt(document.querySelector(".dupa").innerHTML)>0){
    document.querySelectorAll("p").forEach(element => {
      element.style.color="green"
    });
  }
  else{
    document.querySelectorAll("p").forEach(element => {
      element.style.color="red"
    });
  }
  
    const lineColor = Coinprices[0]<Coinprices[Coinprices.length-1]? "rgba(52,168,83,255)" : "rgba(234,67,53,255)"
    const back = Coinprices[0]<Coinprices[Coinprices.length-1]? "rgba(192,228,202,255)" : "rgba(247,213,211,255)"
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: bottom,
          datasets: [{ 
              data: Coinprices,
              label: currency,
              borderColor: lineColor,
              cubicInterpolationMode: 'monotone',
              fill: true,
              backgroundColor: back
            }
          ]
        },
        options: {
          title: {
            display: true,
          }
        }
      });
}
}





function showStonk(stonk, time){
  dzisiejsze.innerHTML=""


    document.getElementById("canvasStore").innerHTML=""
    let canvas = document.createElement("canvas")
    canvas.setAttribute("id", "line-chart")
    document.getElementById("canvasStore").appendChild(canvas)
    

let objects = []
let values = []
if(time=="short"){
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stonk}&interval=30min&apikey=6J2ZMM3BLGAG7KM1`)
    .then((response) => response.json())
    .then(function(data){
      console.log(data)
      for (let key in data["Time Series (30min)"]) {
          objects.push(key)
          values.push(data["Time Series (30min)"][key]['1. open'])
          
      }
  
    })
    .then(()=>makeGraph());

}
  

if(time=="long"){
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${stonk}&apikey=6J2ZMM3BLGAG7KM1`)
  .then((response) => response.json())
  .then(function(data){
    console.log(data)
    for (let key in data["Weekly Adjusted Time Series"]) {
        objects.push(key)
        values.push(data["Weekly Adjusted Time Series"][key]['1. open'])   
    }

  })
  .then(()=>makeGraph());


}



function makeGraph(){
    const back = parseInt(values[0])>parseInt(values[values.length-1])? "rgba(192,228,202,255)" : "rgba(247,213,211,255)"
    const lineColor = parseInt(values[0])>parseInt(values[values.length-1])? "rgba(52,168,83,255)" : "rgba(234,67,53,255)"
    console.log(values[0])
    console.log(values[values.length-1])
    document.getElementById("buttonstore").innerHTML=
    `<button onclick="showStonk('${stonk}', 'short')">OSTATNIE DNI</button>
    <button onclick="showStonk('${stonk}', 'long')">OD POCZĄTKU</button>
    `
    
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: objects.reverse(),
          datasets: [{ 
              data: values.reverse(),
              label: stonk,
              borderColor: lineColor,
              cubicInterpolationMode: 'monotone',
              fill: true,
              backgroundColor: back
              
            }
          ]
        },
        options: {
          title: {
            display: true,
          }
        }
      });
}
}


