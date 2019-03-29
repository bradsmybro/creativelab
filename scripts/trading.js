Vue.component('poke-card', {
	props: {
		poke: Object,
		color: ""
	},
	data: function() {
		return {
			idNum: this.poke._id,	
		}
	},
	computed: {
		colorClass() {
			return "card trading_card" + " trade_" + this.color	
		},
	},	
	methods: {
		selectCard() {
			console.log("Card selected ")
			if(this.color = "red"){
				this.$emit('edit-poke', this.poke)
				this.$root.$emit('bv::show::modal', 'modal-1')
			}	
			else{
				console.log("Other trainers pokeon selected")
			}
		},
	},
	template: `	
			<b-col href="#" v-on:click="selectCard">
				<div :class="colorClass">
					<img :src="poke.path" class="card-img-top" alt="Picture of Pokemon">
					<div class="card-body">
						<h2>{{poke.poke}}</h2>
						<p>Combat Power: {{poke.cp}}</p>
						<p>Type:<span v-for="type in poke.type"> {{type}}</span> </p>
						<p v-if='poke.caught != ""'>Place Caught: {{poke.caught}} </p>
					</div>
				</div>
			</b-col>
	`
})
Vue.component('poke-edit', {
	props: {
		poke: Object,
		color: ""
	},
	data: function() {
		return {
			place: "",
			combat: "",
		}
	},
	computed: {
		colorClass() {
			return "card trading_card" + " trade_" + this.color	
		},
		caught: {
			get(){
				if(this.place == ""){
					return this.poke.caught
				}
				else{
					return this.place
				}
			},
			set(val){
				this.place = val
			},
		},
		cp: {
			get(){
				if(this.combat == ""){
					return this.poke.cp
				}
				else{
					return this.combat
				}
			},
			set(val){
				this.combat= val
			}
		},
		idNum() {
			return this.poke._id
		},
	},	
	methods: {
	   	async deletePoke() {
			console.log("delete")
			let that = this
      		try {
        		let response = await axios.delete("/api/pokemon/" + that.idNum);
				that.combat = ""
				that.place = ""
        		that.$emit('get-poke');
				this.$root.$emit('bv::hide::modal', 'modal-1')
        		return true;
      		} catch (error) {
        		console.log(error);
      		}
		},
		async updatePoke(){
			let that = this
			console.log("update")
      		try {
        		let response = await axios.put("/api/pokemon/" + that.idNum, {
    				cp : that.cp,
   					caught : that.caught,
        		});
				that.combat = ""
				that.place = ""
        		that.$emit('get-poke');
				that.$root.$emit('bv::hide::modal', 'modal-1')
				return true
      		} catch (error) {
        		console.log(error);
				return false
      		}
		},
		cancelPoke(){
			this.$root.$emit('bv::hide::modal', 'modal-1')
		},
	},
	template: `
	<div>	
			<b-col>
				<div :class="colorClass">
					<img :src="poke.path" class="card-img-top" alt="Picture of Pokemon">
					<div class="card-body">
						<h2>{{poke.poke}}</h2>
						Combat Power: 
						<b-input v-model="cp" />
						<p></p>
						<p>Type:<span v-for="type in poke.type"> {{type}}</span> </p>
						Place Caught:
						<b-input v-model="caught" />
					</div>
				</div>
			</b-col>
					<b-row>
						<b-col class="text-right">
						<b-button variant="outline-dark" @click="cancelPoke">Cancel</b-button>	
						<b-button variant="danger" @click="deletePoke">Delete</b-button>
						<b-button variant="dark" @click="updatePoke">Update</b-button>	
						</b-col>
					</b-row>
	</div>
	`
})

var tradingApp = new Vue({
	el:'#tradingApp',
	data: {
		locCaught: "",
		cp: "",
		user: "",
		users: [
			{value: "", text: "Please select your account", disabled: true},
			{value: "Jane", text: "Jane"}, 
			{value: "John", text: "John"},
			{value: "Bob", text: "Bob"},
		],
		selected: "",
		editPokemon: {},
		editPokeName: "",
		editCp: "",
		editCaught: "",
		pokemonTrade: [
			{
				"cp": "2210",
				"caught": "Provo, UT",
				"poke": "Marowak",
				"type": ["ground"],
				"path": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png",
			},
			{
				"cp": "1",
				"caught": "Seoul, Korea",
				"type": ["water"],
				"poke": "Magicarp",
				"path": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png"
			},
		],
		pokemonList: [],
		pokemonCards: [], //List of selected pokemon
	},
	watch: {
		user(newUser) {
			this.getPokemon(newUser)
		},
	},
	created: function(){
		this.listPokemon();
	//	this.getPokemon()
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
					"poke": that.capitalize(response.forms[0].name),
					"user": that.user,
					"cp": that.cp,
					"location": that.locCaught,
					"type": typeArray,
					"pic": pic,
				}
				//call api here?
			   	that.upload(temp)
				that.getPokemon(that.user)
				//that.pokemonCards.push(temp)
				that.selected = ""
				that.cp = ""
				that.locCaught = ""
			})
		},
		async getPokemon() {
  			try {
    			let response = await axios.get("/api/pokemon/" + this.user);
    			this.pokemonCards = response.data;
				console.log("Got them again!")
    			return true;
  			} catch (error) {
    			console.log(error);
  			}
		},
    	async upload(poke) {
      		try {
        		let r1 = await axios.post('/api/addPokemon/trade', {
          			poke: poke.poke,
					user: poke.user,
          			cp: poke.cp,
					type: poke.type,
					caught: poke.location,
					path: poke.pic,
        		});
				this.getPokemon()
				console.log("It has been tried")
      		} catch (error) {
        		console.log(error);
      		}
    	},
		editPoke(poke){
			console.log("Edit the poke!")
			this.editPokemon = poke
			this.$root.$emit('bv::show::modal', 'modal-1')
		},
		capitalize(string){
			return string.charAt(0).toUpperCase() + string.slice(1)
		},
	},
	
})
