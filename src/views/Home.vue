<template>
    <div class="home">
        <form class="form-inline col-10 justify-content-center" style="align-self: center;" @submit="filter" ref="searchFormRef">
            <input class="form-control mr-sm-2 col-10" type="search" placeholder="Фильтр" aria-label="Search" v-model="filter_string">
            <button class="btn btn-outline-primary my-2 my-sm-0 col-1" type="submit">Search</button>
        </form>
        <div id="chart" class="">
            <Chart :events="events"/>
        </div>
        <br>
        <div id="search"></div>
        <div id="events">
            <EventsTable :events="events" @activityClick="filterByActivityId" @badgeClick="filterByBadge" @timeClicked="filterByTimeRange"/>
<!--        <div v-for="(event, key) in events" :key="key">-->
<!--            {{event}}-->
<!--        </div>-->
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from 'vue';
import EventsTable from '@/components/EventsTable';
import Chart from '@/components/Chart';

export default {
    name: 'Home',
    setup() {
        const store = useStore()
        const event = ref('')
        const events = ref ({})
        const filter_string = ref('')
        const searchFormRef = ref(null)
        store.dispatch('getAllEvents')
        .then((data) => {
            event.value = data[0].innerHTML
            data = Array.prototype.slice.call(data, 0)
            console.log(data[0])
            data.forEach((event) => {
                events.value[Date.parse(event.children[0].getElementsByTagName("TimeCreated")[0].getAttribute("SystemTime"))] =
                    event
            })
            events.value = { ...Object.fromEntries(Object.entries(events.value).sort())}
        })

        const filter = (e) => {
            if (e !== undefined)
                e.preventDefault()
            store.dispatch('getFilteredEvents', filter_string.value)
            .then((data) => {
                console.log('done')
                data = Array.prototype.slice.call(data, 0)
                console.log(data[0])
                events.value = {}
                data.forEach((event) => {
                    events.value[Date.parse(event.children[0].getElementsByTagName("TimeCreated")[0].getAttribute("SystemTime"))] =
                        event
                })
                events.value = { ...Object.fromEntries(Object.entries(events.value).sort())}
            })
            .catch((err) => {
                console.error(err)
            })
        }

        const filterByActivityId = (activityId) => {
            filter_string.value = `*:System/*:Correlation/@ActivityID='${activityId}'`
            filter()
        }

        const filterByBadge = (badge) => {
            filter_string.value = `*:RenderingInfo/*:Keywords/*:Keyword='${badge}'`
            filter()
        }

        const filterByTimeRange = (filter_str) => {
            filter_string.value = filter_str
            filter()
        }

        return {
            event,
            events,
            filter,
            filter_string,
            filterByActivityId,
            searchFormRef,
            filterByBadge,
            filterByTimeRange
        }
    },
    components: {
        EventsTable,
        Chart
    }
}
</script>

<style lang="scss">
.home {
    display: flex;
    flex-direction: column;
    #chart {

        height:50vh;
    }

    canvas {
        margin: auto;
        height: 100%;
    }
}
#events {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
