<template>
    <table class="table col-11">
        <thead class="thead-dark sticky-top">
        <tr>
            <th scope="col">Время</th>
            <th scope="col">Уровень</th>
            <th scope="col">Task(опциональное поле)</th>
            <th scope="col">Канал</th>
            <th scope="col">Провайдер</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(event, key) in events" :key="key"  @click="getInfo(key)" data-toggle="modal" data-target="#infoModal">
            <th scope="row">{{new Date(Number(key)).toLocaleString()}}</th>
            <td>{{getLevel(event)}}</td>
            <td>{{getTask(event)}}</td>
            <td>{{getChannel(event)}}</td>
            <td>{{getProvider(event)}}</td>
        </tr>
        </tbody>
    </table>
    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModal" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Информация о событии</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div v-if="event_element" class="modal-body" style="text-align:left;">
                    <span style="white-space: break-spaces;"><strong>Сообщение события:</strong> <br>{{event_element.getElementsByTagName("Message")[0].innerHTML}}</span><br>
                    <strong>Время события: </strong><span  data-dismiss="modal" @click="onTimestampClick(event_element.getElementsByTagName('TimeCreated')[0].getAttribute('SystemTime'))">{{event_element.getElementsByTagName("TimeCreated")[0].getAttribute("SystemTime")}}</span><br>
                    <strong>Тип события: </strong><span>{{eventIDs[event_element.getElementsByTagName("EventID")[0].innerHTML]}}</span>
                    <br>
                    <strong>Данные события:</strong> <br>
                    <div style="padding-left: 10px;">
                        <template v-for="data_ in event_element.getElementsByTagName('Data')" :key="data_.getAttribute('Name')">

                            <span>

                                <template v-if="data_.getAttribute('Name') != undefined">
                                    {{data_.getAttribute('Name')}}
                                </template>
                                <template v-else>
                                    Нет имени
                                </template>: {{data_.innerHTML}}

                            </span><br>
                        </template>
                    </div>
                    <span>Теги: </span>
                    <template v-for="keyword in event_element.getElementsByTagName('Keyword')" :key="keyword.innerHTML">
                        <span class="badge badge-primary" style="border: 1px solid black; border-radius:8px; padding: 3px;" data-dismiss="modal" @click="clickedBadge(keyword.innerHTML)">{{keyword.innerHTML}}</span>
                    </template>
                    <br>
                    <template v-if="event_element.getElementsByTagName('Correlation')[0].getAttribute('ActivityID') != undefined">
                        <span style="border: 1px solid black; border-radius:8px; padding: 3px;" data-dismiss="modal" @click="clickedActivity">Коррелирующая активность: {{event_element.getElementsByTagName('Correlation')[0].getAttribute('ActivityID')}}</span>
                    </template>
                    <br>
                    <span>Исходный xml:</span><br>
                    <pre lang="xml" >{{event_info}}</pre>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { eventIDs } from '@/utils.js';

export default {
    props: {
        events: {
            type: Object,
            required: true,
        },
    },
    name: "EventsTable",
    emits: {
        'activityClick': null,
        'badgeClick': null,
        'timeClicked': null,
    },
    setup(props, { emit }) {
        const event_info = ref('')
        const event_element = ref(props.events[Object.keys(props.events)[0]])
        console.log(event_element.value)
        const getLevel = (event) => {
            if (event.getElementsByTagName("RenderingInfo").length > 0) {
                return event.getElementsByTagName("RenderingInfo")[0].getElementsByTagName("Level")[0].innerHTML;
            }
            else
                return ""
        }
        const getTask = (event) => {
            if (event.getElementsByTagName("RenderingInfo").length > 0) {
                return event.getElementsByTagName("RenderingInfo")[0].getElementsByTagName("Task")[0].innerHTML;
            }
            else
                return ""
        }
        const getChannel = (event) => {
            if (event.getElementsByTagName("RenderingInfo").length > 0) {
                return event.getElementsByTagName("RenderingInfo")[0].getElementsByTagName("Channel")[0].innerHTML;
            }
            else
                return ""
        }
        const getProvider = (event) => {
            if (event.getElementsByTagName("RenderingInfo").length > 0) {
                return event.getElementsByTagName("RenderingInfo")[0].getElementsByTagName("Provider")[0].innerHTML;
            }
            else
                return ""
        }
        const getInfo = (key) => {
            console.log("her")
            console.log(props.events[key])
            event_info.value =props.events[key].outerHTML
            event_element.value = props.events[key]
        }
        const clickedActivity = () => {
            emit('activityClick', event_element.value.getElementsByTagName('Correlation')[0].getAttribute('ActivityID'))
        }
        const clickedBadge = (badge) => {
            console.log(badge)
            emit('badgeClick', badge)
        }

        const onTimestampClick = (time) => {
            console.log(time)
            let timestamp = Date.parse(time)
            let start = timestamp - 1000*60*15
            let end = timestamp + 1000*60*15
            let start_ts = new Date(start).toISOString()
            let end_ts = new Date(end).toISOString()
            emit('timeClicked',
                `xs:dateTime(*:System/*:TimeCreated/@SystemTime) ge xs:dateTime('${start_ts}') and xs:dateTime(*:System/*:TimeCreated/@SystemTime) le xs:dateTime('${end_ts}')`)
        }

        return {
            getLevel,
            getTask,
            getChannel,
            getProvider,
            getInfo,
            event_info,
            event_element,
            clickedActivity,
            clickedBadge,
            eventIDs,
            onTimestampClick
        }
    },

}
</script>

<style scoped lang="scss">
thead > tr {
    th:first-child {
        border-top-left-radius: 12px;
    }
    th:last-child {
        border-top-right-radius: 12px;
    }
}
tbody > tr {
    &:nth-child(even) {
        background-color: #ddd;
    }
    &:last-child {
        th {
            border-bottom-left-radius: 12px;
        }
        td:last-child {
            border-bottom-right-radius: 12px;
        }
    }

}
.modal-dialog {
    max-width: 90vw;
}
</style>
