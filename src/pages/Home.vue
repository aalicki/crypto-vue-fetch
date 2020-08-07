<template>
  <div class="home page">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { RAPID_API_KEY } from '../.env'
import axios from 'axios'

export default {
  name: 'IndexPage',
  components: {
  },
  data () {
    return {
      msg: 'CrytpoTracker',
      bearer_token: '',
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
    // Fetch token asset information
    fetchTokenID: function (fetchSymbol) {
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
          this.fetchTokenData(fetchSymbol, this.fetchSymbolsMap[fetchSymbol])
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // Fetch the token information
    fetchTokenData: function (symbol, symbolID) {
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
          console.log(this.coinData[symbol])
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted () {
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

        // Set our token IDs
        this.fetchTokenID('BTC')
        this.fetchTokenID('BCH')
        this.fetchTokenID('LTC')
        this.fetchTokenID('USDT')

        // Now fetch the token information
        // this.fetchTokenData()
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
