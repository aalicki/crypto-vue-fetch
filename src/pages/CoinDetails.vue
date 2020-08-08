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
         NAME HERE | {{this.coinSymbol}}
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
      coinName: '',
      coinSymbol: this.$route.params.symbol,
      fetchSymbolsMap: {
        BTC: true,
        BCH: true,
        USDT: true,
        LTC: true
      },
      coinData: {
        btcData: true,
        bchData: true,
        usdtData: true,
        ltcData: true
      }
    }
  },
  methods: {
    // Fetch Coin asset information
    fetchCoinID: function (fetchSymbol) {
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
          this.fetchSymbolsMap[fetchSymbol] = response.data.content[0].id

          // Fetch and update our coin data (maybe put this in a loop?)
          this.fetchCoinData(fetchSymbol, this.fetchSymbolsMap[fetchSymbol])
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
          assetId: symbolID
        }
      })
        .then((response) => {
          // update our coin data
          this.coinData[symbol] = response.data.content[0]
        })
        .catch((error) => {
          console.log(error)
        })
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
        this.fetchCoinID('BCH')
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
