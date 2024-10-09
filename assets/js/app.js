/*lógica de Programação
    1-Pegar os dados do Input, quando o botão for clicado
    2-Fazer uma requisição no servidor
     Pela API e Trazer os Produtos.
    3-Colocar os produtos na tela.
    4-Criar o Gráfico de Preços.
*/
//criar as varieveis para pegar os elementos html
const formDados = document.querySelector('.form-search')
const prodList = document.querySelector('.product-list')
const canva = document.querySelector('.grafic-char')

let grafics = ''

//add event para o fomulario quando for submetido pelo button
//usando uma erofuntion assincrona
formDados.addEventListener('submit', async (event) => {
    //impede que o evento padrão aconteça
    event.preventDefault()
    //atribuindo o valor o input a variavel atraves do target
    const inputValor = event.target[0].value

    //await para esperar o servidor respoder
    //fetch para usar API
    //linkAPI+inputValor concatenando o link da API e o valor recebido do Input
    const dataProducts = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValor}`)
    //converter os dados do servidos em Json e pegar apenas o resultado, e mostrar apenas 20 elementos
    //slice() funcao para dividir
    const produtos = (await dataProducts.json()).results.slice(0, 20)
    showItens(produtos)
    showGrafics(produtos)

})

//funcao para mostrar os itens na tela
function showItens(produtos) {
    //add elementos html
    //map() mapea um array percorrendo um a um
    prodList.innerHTML = produtos.map(itens => `
        <div class="product-card">
            <img class="img-card" src="${itens.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${itens.title}">
            <h3 class="title-card">${itens.title}</h3>
            <p class="price-card">${itens.price.toLocaleString('pt-BR',
        { style: 'currency', currency: 'BRL' })}</p>
            <p class="seller-card"><span>Loja</span>: ${itens.seller.nickname}</p>
        </div>
    
    `).join('')

}
function showGrafics(produtos) {
    const ctx = canva.getContext('2d')
    if (grafics) {
        grafics.destroy()
    }

    grafics = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: produtos.map(itens => itens.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: produtos.map(itens => itens.price),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        optins: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => {
                            return 'R$ ' + value.toLocaleString('pt-BR',
                                { style: 'currency', currency: 'BRL' })
                        }
                    },
                    Plugins:{
                        legend:{
                            display: false
                        },
                        title:{
                            display:true,
                            text:'Comparador de Preços',
                            font:{
                                size:18
                            }
                        }
                    }
                }
            }
        }
    })

}
