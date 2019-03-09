Vue.component('poke-card', {
	props: {
		poke: Object,
		color: ""
	},
	data: function() {
		return {
			
		}
	},
	computed: {
		colorClass() {
			return "card trading_card" + " trade_" + this.color	
		},
	},	
	template: `
		
			<b-col>
				<div :class="colorClass">
					<img :src="poke.pic" class="card-img-top" alt="Picture of Pokemon">
					<div class="card-body">
						<h2>{{poke.name}}</h2>
						<p>Combat Power: {{poke.cp}}</p>
						<p>Type:<span v-for="type in poke.type"> {{type}}</span> </p>
						<p v-if='poke.location != ""'>Place Caught: {{poke.location}} </p>
					</div>
				</div>
			</b-col>
	`
})
var tradingApp = new Vue({
	el:'#tradingApp',
	data: {
		locCaught: "",
		cp: "",
		selected: "",
		pokemonTrade: [
			{
				"cp": "2210",
				"location": "Provo, UT",
				"name": "Marowak",
				"type": ["ground"],
				"pic": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png",
			},
			{
				"cp": "1",
				"location": "Seoul, Korea",
				"type": ["water"],
				"name": "Magicarp",
				"pic": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png"
			},
		],
		pokemonList: [],
		pokemonCards: [], //List of selected pokemon
	},
	created: function(){
		this.listPokemon();
	},
	methods: {
		getPokemon(name){
			// https://pokeapi.co/api/v2/<name>
			//After it is called store the pokemon information locally to reduce api calls?
		},	
		listPokemon(){
			//create list of pokemon names api call is https://pokeapi.co/api/v2/pokemon
			let that = this
			$.get('https://pokeapi.co/api/v2/pokemon', function(response){
				$.get('https://pokeapi.co/api/v2/pokemon/?limit=' + response.count, function(data){
					for(poke in data.results){
						data.results[poke].text = that.capitalize(data.results[poke].name)
						data.results[poke].value = data.results[poke].url
						delete data.results[poke].name
						delete data.results[poke].url
					}
					data.results.sort(function(a,b) {
						var textA = a.text.toUpperCase();
    					var textB = b.text.toUpperCase();
    					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
					})
					that.pokemonList = data.results
				})
				console.log(response)
			})
		},
		addCard(e) {
			e.preventDefault()
			let that = this
			//Will add a card object to the pokemon card list
			console.log("Adding card")
			$.get(this.selected, function(response){ 
				console.log(response)
				let typeArray = []
				let pic = ""
				for(type in response.types){
					typeArray.push(response.types[type].type.name)
				}

				pic = response.sprites.front_default

				var temp = {
					"poke": that.selected,
					"name": that.capitalize(response.forms[0].name),
					"cp": that.cp,
					"location": that.locCaught,
					"type": typeArray,
					"pic": pic,
				}
				that.pokemonCards.push(temp)
				that.selected = ""
				that.cp = ""
				that.locCaught = ""
			})
		},
		capitalize(string){
			return string.charAt(0).toUpperCase() + string.slice(1)
		},
	},
	
})
