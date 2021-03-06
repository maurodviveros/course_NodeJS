'use strict';
require('dotenv').config();
const axios = require("axios");

module.exports = class Busquedas{
    historial = ["Tegucigalpa", "Madrid", "Bogotá"];

    constructor(){};

    async getCiudades(ciudadQuery){
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ ciudadQuery }.json`,
            params: {
                "language"      : "es",
                "limit"         : 5,
                "access_token"  : process.env.MAPBOX_TOKEN
            }
        });

        try{
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                latitud: lugar.center[1],
                longitud: lugar.center[0]
            }));

        } catch(error){
            return [];
        };
    };

    async getClima(lat, lon){
        const instance = axios.create({
            baseURL: "https://api.openweathermap.org/data/2.5/weather",
            params: {
                "appid" : process.env.OPENWEATHER_TOKEN,
                "lat"   : lat,
                "lon"   : lon
            }
        });

        try{
            const resp = await instance.get();
            return resp.data.main;
        } catch(eeror){
            return [];
        };
    };
};