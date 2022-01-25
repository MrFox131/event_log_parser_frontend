import { createStore } from 'vuex';
import axios from 'axios';
import {parseEventsFromXML} from "@/utils";


export default createStore({
  state: {
    existAppUrl: process.env.VUE_APP_EXIST_APP_URL
  },
  mutations: {
  },
  actions: {
    getAllEvents({state}) {
      return new Promise((resolve, reject) => {
        axios.get(state.existAppUrl + '/get_entry.xq')
            .then((data) => {
              resolve(parseEventsFromXML(data.data))
            })
            .catch((err) => {
              reject(err)
            })
      })
    },
    getFilteredEvents({state}, filter) {
      return new Promise((resolve, reject) => {
        axios.get(state.existAppUrl + '/get_entry.xq?query='+filter)
            .then((data) => {
              resolve(parseEventsFromXML(data.data))
            })
            .catch((err) => {
              reject(err)
            })
      })
    }
  },
  modules: {
  }
})
