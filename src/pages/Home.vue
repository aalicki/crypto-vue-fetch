<template>
  <div class="home page">
    <div class="row">
      <div class="container">
        <div v-if="!this.dataFetched" class="loading">
          Loading...
        </div>
        <hr>

        <table class="table" v-if="this.dataFetched">
          <thead>
          <th>Coin Name</th>
          <th>Symbol</th>
          <th>Latest Price</th>
          <th></th>
          </thead>
          <tbody>
          <tr>
            <td>BitCoin</td>
            <td>BTC</td>
            <td>${{this.coinData.BTC.price}}</td>
            <td>
              <button class="btn btn-info" v-on:click="coinDetailClick('BTC')">Details</button>
            </td>
          </tr>
          <tr>
            <td>BitCoin Cash</td>
            <td>BCH</td>
            <td>${{this.coinData.BCH.price}}</td>
            <td>
              <button class="btn btn-info" v-on:click="coinDetailClick('BCH')">Details</button>
            </td>
          </tr>
          <tr>
            <td>Tether</td>
            <td>USDT</td>
            <td>${{this.coinData.USDT.price}}</td>
            <td>
              <button class="btn btn-info" v-on:click="coinDetailClick('USDT')">Details</button>
            </td>
          </tr>
          <tr>
            <td>LiteCoin</td>
            <td>LTC</td>
            <td>${{this.coinData.LTC.price}}</td>
            <td>
              <button class="btn btn-info" v-on:click="coinDetailClick('LTC')">Details</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { RAPID_API_KEY } from '../.env'
import axios from 'axios'
import router from '@/router'

export default {
  name: 'IndexPage',
  components: {
  },
  data () {
    return {
      msg: 'CrytpoTracker',
      dataFetched: false,
      events: [],
      bearer_token: false,
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
    },

    // Send user to the coin details page to view data
    coinDetailClick: function (toSymbol) {
      router.push(`coin-details?symbol=${toSymbol}`)
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
        this.fetchCoinID('BTC')
        this.fetchCoinID('LTC')
        this.fetchCoinID('USDT')
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
