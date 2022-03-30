let modalQuantidade = 1;
let modalDataKey = 0;
let cart = []
const queryS = element => document.querySelector(element),
      queryAll = element => document.querySelectorAll(element);


pizzaJson.map( (item, indexOf) => {
    let pizzaItem = queryS('.pizza-item').cloneNode(true);
    

    // data-key em cada item da lista para saber qual é o item que está selecionado
    pizzaItem.setAttribute('data-key', indexOf);

    // Itens adicionados 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${(item.price).toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Abrindo modal  
    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        e.preventDefault();
        // usando o target.closet eu pego o elemento mais próximo com a clase especificada que tenha acionado o evento de click
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQuantidade = 1;
        modalDataKey = key;

        queryS('.pizzaBig img').src = pizzaJson[key].img;
        queryS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        queryS('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        queryS('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[key].price).toFixed(2)}`;
        queryS('.pizzaInfo--size.selected').classList.remove('selected');
        queryAll('.pizzaInfo--size').forEach((size,index) => {
            if (index == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[index]

        });

        queryS('.pizzaInfo--qt').innerHTML = modalQuantidade;
        //Animação suave do modal
        queryS('.pizzaWindowArea').style.opacity = '0';
        setTimeout( () => {
            queryS('.pizzaWindowArea').style.opacity = '1';    
        },200)
        queryS('.pizzaWindowArea').style.display = 'flex' ;
        
    });

    // Adicionando todas as mudança feitas na pizzaItem para pizzaArea
    document.querySelector('.pizza-area').append(pizzaItem); 
});


// Modal

function closeModal() {
    queryS('.pizzaWindowArea').style.opacity = '0';
    setTimeout( () => {
        queryS('.pizzaWindowArea').style.display = 'none';
    },500)
     
}


// botão de menos e mais

// mais 
queryS('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQuantidade ++;
    queryS('.pizzaInfo--qt').innerHTML = modalQuantidade;
})
// menos 
queryS('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if ( modalQuantidade > 1 ){
        modalQuantidade--;
        queryS('.pizzaInfo--qt').innerHTML = modalQuantidade;
    }  
})

// lógica para marca a caixa de tamanho, essa lógica pode ser usada em qualquer cenário que vc precisar marca uma seleção única.

// Primeiro se faz um for para listar todos os elementos que tem a classe que vai ser aplicadda o efeito
queryAll('.pizzaInfo--size').forEach((size, index) => {
    //Depois adicionar o evento de clique para os items
    size.addEventListener('click', () => {
        // Primeiro retirar todas as classes selecionadas
        queryS('.pizzaInfo--size.selected').classList.remove('selected');
        // depois usar o size para pegar o próprio elemente e aí sim pode adicionar a classe.
        size.classList.add('selected');
    })

})

queryS('.pizzaInfo--addButton').addEventListener('click', () => {
    let sizePizza = parseInt(queryS('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalDataKey].id+'@'+sizePizza

    let key = cart.findIndex((item) => item.identifier == identifier);

    if ( key > -1 ) cart[key].qt = modalQuantidade
    else{
        cart.push({
            identifier,
            id:pizzaJson[modalDataKey].id,
            size: sizePizza,
            qt:modalQuantidade
        });
    }
    
    closeModal();
    uptadeCart();
    
})

function uptadeCart(){
    queryS('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0){
        queryS('aside').classList.add('show')
        // zerando cart
        queryS('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart){
            let pizzaitem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaitem.price * cart[i].qt;

            let cartItem = queryS('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaitem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaitem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaitem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                uptadeCart();
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if ( cart[i].qt > 1){
                    cart[i].qt--;
                }
                else {
                    cart.splice(i, 1);
                }
                uptadeCart();
            })
            queryS('.cart').append(cartItem);
            
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        queryS('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        queryS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        queryS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    }
    else {
        queryS('aside').classList.remove('show');
        queryS('aside').style.left = '100vw';
    }

}

queryS('.menu-openner').addEventListener('click', () => {
    if ( cart.length > 0){
        queryS('aside').style.left = '0';
    }
})
queryS('.menu-closer').addEventListener('click', () => queryS('aside').style.left = '100vw');



