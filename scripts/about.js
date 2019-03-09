var aboutApp = new Vue({
	el:'#aboutApp',
	data: {
		pictures: [], //Have list of pictures for slides?
		factsList: [], //List of facts that will be picked from when page loads	
	},
	computed: {
		randomFact() {
			return factsList[getRandom(0, factsList.length())]
		},
	},
	created: function(){
	
	},
	methods: {
		getRandom(min, max){
  			min = Math.ceil(min)
      		max = Math.floor(max)
      		return Math.floor(Math.random() * (max - min + 1)) + min
		},
	},
	
})
