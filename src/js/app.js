/**
 * Created by AlvaroBelmonte on 16/04/2016.
 */
angular.module('App', [])
    .controller('myCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

        var bootstrap_enabled = (typeof $().modal == 'function');
        console.log(bootstrap_enabled);

        var self = this;
        self.n = 0;
        self.respuesta = '';
        self.terminado = false;
        self.cargado = false;
        self.puntuacion = 0;
        self.preguntas = 0;
        self.aciertos = 0;
        self.respuestas=[];
        self.cuestionario ='';

        var url = $location.absUrl()+'data/';

        self.cargarCuestionario = function(){
            self.terminado = false;
            self.n = 0;
            self.respuesta = '';
            $http.get(url+self.cuestionario).success(function(datos)
            {
                self.datos = datos.preguntas;
                self.cargado = true;
            }, function(errResponse){
                console.error('Error');
            });

        };

        self.anterior = function(){
            if(self.n>0)
                self.n--;
            self.respuesta = self.respuestas[self.n];
        };

        self.siguiente = function(){
            self.aviso = false;
            self.comprobarRespuesta();
            self.respuesta = self.respuestas[self.n];
        };

        self.terminar = function(){
            self.siguiente();
            //Si la última pregunta se ha contestado, se obtiene la puntuación
            if(self.comprobarRespuesta()){
                self.obtenerPuntuacion();
                self.terminado = true;
                self.cargado = false;
                self.respuestas = [];
            }
        };

        self.comprobarRespuesta = function() {
            if (self.respuesta !=='' && self.respuesta !== undefined) {
                self.respuestas[self.n] = self.respuesta;

                if (self.n < self.datos.length - 1)
                    self.n++;

                return true;
            }
            else {
                self.aviso = true;
                return false;
            }
        };

        self.obtenerPuntuacion = function(){
            var correctas = 0;
            for(i=0; i<self.datos.length; i++){
                if(self.datos[i].respuesta==self.respuestas[i])
                    correctas++;
            }

            self.aciertos = correctas;
            self.preguntas = self.datos.length;

            self.puntuacion=(10/self.datos.length)*correctas;
            self.puntuacion = self.puntuacion.toFixed(2);
        };

    }]);



