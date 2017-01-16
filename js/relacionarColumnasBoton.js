        var mensajes = {
            "opcionIncorrecta":"Incorrecto, por favor intenta de nuevo.",
            "opcionIncorrectaTerminoIntentos":"Incorrecto, intenta con la siguiente pregunta.",
            "retroFinal":"Terminaste. Obtuviste %BUENAS% de %TOTAL%."
        };
        window.addEventListener("load", function(e){
            var MAX_INTENTOS_POR_PREGUNTA = 2;
            var filasReactivos = document.querySelectorAll(".tablaEjercicio tr");
            var preguntaActivaNum = 0;
            var buenas = 0;
            var filaActiva;
            var respuestas = [];
            var botones = [];
            var currentIntento;
            var retro = (function (){
                var retroFinal = document.getElementById("retroFinal");
                var mensajeFinal = document.getElementById("retroFinalMensaje");
                retroFinal.addEventListener("click", quitarRetro, false);
                document.getElementById("botonCerrarRetro").addEventListener("click", quitarRetro, false);
                function quitarRetro(){
                    retroFinal.style.display = "none";
                }
                function darRetroPop(mensaje) {
                    retroFinal.style.display = "";
                    mensajeFinal.innerHTML = mensaje;
                }
                return {mostrar:darRetroPop};
            })();

            var tempPregunta;
            var tempBoton;
            var tempRespuesta;
            Array.prototype.forEach.call(filasReactivos, function(fila){
                tempPregunta = fila.querySelector("td");
                tempRespuesta = fila.querySelector("td.celdaRespuesta");
                tempBoton = fila.querySelector("td.boton");//Es la celda, no el botón en sí
                fila.respuesta = tempRespuesta;
                respuestas.push(tempRespuesta);
                botones.push(tempBoton);
                tempRespuesta.parentNode.removeChild(tempRespuesta);

                /*
                 Al apretar un botón, se revisa si la respuesta es correcta
                 Se marca correcta o incorrecta
                 Se procede a la siguiente pregunta
                 */
                tempBoton.addEventListener("click", alApretarOpcion, false);

            });

            shuffle(respuestas);

            Array.prototype.forEach.call(filasReactivos, function(fila, index){
                fila.appendChild(respuestas[index]);
            });

            activarPregunta(preguntaActivaNum);

            var botonReiniciar = document.querySelector("#botonReiniciar");
            botonReiniciar.style.display = "none";
            botonReiniciar.addEventListener("click", function(){
                window.location.reload(false);
            }, false);

            function alApretarOpcion(e){
                e.stopPropagation();
                e.preventDefault();
                // console.log("compara", filaActiva.respuesta, e.currentTarget.nextElementSibling);
                if(filaActiva.respuesta === e.currentTarget.nextElementSibling){
                    console.log("bien");
                    buenas++;
                    filaActiva.querySelector("td").className = "contestada bien";
                    var bInterno = e.currentTarget.querySelector("button");
                    bInterno.innerHTML = String(preguntaActivaNum + 1);
                    bInterno.disabled = true;
                    e.currentTarget.removeEventListener("click", alApretarOpcion, false);
                    e.currentTarget.className += " contestada";
                    pasarSiguientePregunta();
                } else {
                    console.log("mal");
                    //e.currentTarget.className = "usado";
                    retro.mostrar(mensajes["opcionIncorrecta"]);
                    if(++currentIntento >= MAX_INTENTOS_POR_PREGUNTA){
                        filaActiva.querySelector("td").className = "contestada mal";
                        retro.mostrar(mensajes["opcionIncorrectaTerminoIntentos"]);
                        pasarSiguientePregunta();
                    }
                }
            }
            function pasarSiguientePregunta(){
                var botonesUsados = document.querySelectorAll(".tablaEjercicio .usado");
                Array.prototype.forEach.call(botonesUsados, function(boton){
                    //boton.className = "";
                });
                preguntaActivaNum++;
                if(preguntaActivaNum < filasReactivos.length){
                    activarPregunta(preguntaActivaNum);
                } else {
                    botonReiniciar.style.display = "inherit";
                    retro.mostrar(reemplazarTexto(mensajes["retroFinal"], {"%BUENAS%": String(buenas), "%TOTAL%": String(filasReactivos.length)}));
                }
            }
            function activarPregunta(numero){
                filaActiva = filasReactivos[numero];
                filaActiva.querySelector("td").className = "activa";
                currentIntento = 0;
            }

            /* Función para revolver respuestas */
            function shuffle(array) {
                var currentIndex = array.length
                        , temporaryValue
                        , randomIndex
                        ;
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }
            function reemplazarTexto(cadenaCruda, objetoReemplazos){
                return cadenaCruda.replace(/%\w+%/g, function(reemplazo) {
                    //console.log("reemplazo: ", reemplazo);
                    return objetoReemplazos[reemplazo] || reemplazo;
                });
            }
            //console.log("prueba reemplazo: ", reemplazarTexto('My Name is %NAME% and my age is %AGE%, the following %TOKEN% is invalid. y gano el 10% de lo que tú',  {"%NAME%": "Mike","%AGE%": "26","%EVENT%": "20"}));
        }, false);