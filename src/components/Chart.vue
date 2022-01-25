<template>
    <Vue3ChartJs ref="chartRef" v-bind="barChart"/>
</template>

<script>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import { ref, watch } from 'vue';

export default {
    name: "Chart",
    props: {
        events: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const chartRef = ref(null)
        const barChart = ref({
            type: "bar",
            options: {
                min: 0,
                max: 100,

                plugins: {
                    legend: {
                        position: "top"
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: (value) => {
                                return `${value}`;
                            }
                        }
                    }
                }
            },
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Количество событий",
                        backgroundColor: ["#2980b9"],
                        data: [],
                    }
                ],
            }
        });

        const updateData = (events) => {
            const event_keys = Object.keys(events).sort(function (a, b) {
                return a - b;
            });
            console.log(event_keys[0], event_keys[2])
            console.log(event_keys)
            const range = Math.ceil((event_keys[event_keys.length - 1] - event_keys[0]) / (1000 * 60 * 60 * 24))
            console.log("Рэндж", range)
            const data = []
            console.log(data)
            const labels = []
            let current_time = Number(event_keys[0])
            let current_counter = 0

            for (let current_event = 0; current_event < event_keys.length; current_event++) {
                if (current_time + 1000 * 60 * 15 >= Number(event_keys[current_event])) {
                    current_counter += 1
                } else {
                    data.push(current_counter)
                    labels.push('')
                    current_counter = 1
                    current_time = Number(event_keys[current_event])
                }
            }
            if (current_counter >= 0) {
                data.push(current_counter)
                labels.push('')
            }
            console.log("Данные: ", data)
            barChart.value.data.datasets[0].data = data;
            barChart.value.data.labels = labels;
            barChart.value.options.scales.y.max = Math.max(data)
        }

        updateData(props.events)

        watch(
            () => props.events,
            (events) => {
                updateData(events)
                chartRef.value.update(750);
            }
        )
        return {
            barChart,
            chartRef
        }
    },
    components: {
        Vue3ChartJs,
    }
}
</script>

<style scoped>

</style>
