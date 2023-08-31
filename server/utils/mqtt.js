import mqtt from "mqtt";

const MQTT_BROKER_URL = "wss://broker.emqx.io:8084/mqtt";
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker 😄");
});

mqttClient.on("error", (err) => {
  console.log("Error while connecting to broker: ", err);
});
export default {
  getClient: () => mqttClient
};
