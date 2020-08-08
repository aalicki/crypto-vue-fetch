<template>
  <div class="home page">
    <div class="row">
      <div class="container">
        <h1>{{ msg }}</h1>
        <div v-if="!this.dataFetched" class="loading">
          Loading...
        </div>
        <hr>
        <div v-if="this.dataFetched">
          <h2>{{this.coinAsset.name}} | {{this.coinSymbol}}</h2>
          <strong>Price:</strong> ${{Number(this.coinData.price).toLocaleString('en', this.currencyOptions)}}<br>
          <strong>24-HR Volume:</strong> {{this.coinData.volumePercentChange.change24h}}<br>
          <strong>$100 = </strong> {{this.purchaseRates[100]}}<br>
          <strong>$250 =</strong> {{this.purchaseRates[250]}}<br>
          <strong>$5,000 = </strong> {{this.purchaseRates[5000]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RAPID_API_KEY } from '../.env'
import axios from 'axios'

export default {
  name: 'CoinDetailPage',
  components: {
  },
  data () {
    return {
      msg: 'CrytpoTracker: Coin Details',
      dataFetched: false,
      events: [],
      bearer_token: false,
      coinSymbol: this.$route.params.symbol,
      coinAsset: false,
      coinData: false,
      currencyOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      purchaseRates: {
        100: 0,
        250: 0,
        5000: 0
      }
    }
  },
  methods: {
    // Fetch Coin asset information
    fetchCoinAssetInfo: function (fetchSymbol) {
      axios({
        method: 'GET',
        url: 'https://bravenewcoin.p.rapidapi.com/asset',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY,
          authorization: `Bearer ${this.bearer_token}`,
          useQueryString: true
        },
        params: {
          status: 'ACTIVE',
          symbol: fetchSymbol
        }
      })
        .then((response) => {
          // Update our id map with the fetched IDs
          this.coinAsset = response.data.content[0]

          // Fetch and update our coin data (maybe put this in a loop?)
          this.fetchCoinData(fetchSymbol, this.coinAsset.id)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // Fetch the coin information
    fetchCoinData: function (symbol, symbolID) {
      axios({
        method: 'GET',
        url: 'https://bravenewcoin.p.rapidapi.com/market-cap',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY,
          authorization: `Bearer ${this.bearer_token}`,
          useQueryString: true
        },
        params: {
          assetId: symbolID,
          percentChange: true
        }
      })
        .then((response) => {
          console.log(response.data)

          // update our coin data
          this.coinData = response.data.content[0]

          // calculate our purchase amounts
          this.calculatePurchaseForUSD(100)
          this.calculatePurchaseForUSD(250)
          this.calculatePurchaseForUSD(5000)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // Calculate the purchase rates
    calculatePurchaseForUSD: function (amount) {
      this.purchaseRates[amount] = amount / this.coinData.price
    }
  },
  mounted () {
    // Ensure all the APIs before showing UI.
    // TODO: implement better Promise handling.
    setTimeout(() => {
      console.log('Data All Fetched')
      this.dataFetched = true
    }, 2000)
  },
  created () {
    console.log('route', this.$route.params.symbol)

    // Get our Auth Token
    axios({
      method: 'POST',
      url: 'https://bravenewcoin.p.rapidapi.com/oauth/token',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY,
        accept: 'application/json',
        useQueryString: true
      },
      data: {
        audience: 'https://api.bravenewcoin.com',
        client_id: 'oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY',
        grant_type: 'client_credentials'
      }
    })
      .then((response) => {
        // Set our token
        this.bearer_token = response.data.access_token
      })
      .then(() => {
        // Set our token IDs
        this.fetchCoinAssetInfo(this.coinSymbol)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
