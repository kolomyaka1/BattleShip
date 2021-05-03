var view = { 
    displayMessage : function(msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit : function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss : function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

var model = {
    boardSize : 7,
    numShips : 3,
    shipsSunk : 0,
    shipLength : 3,
    
    ships : [{locations : [0, 0, 0], hits : ['', '', '']},
             {locations : [0, 0, 0], hits : ['', '', '']},
             {locations : [0, 0, 0], hits : ['', '', '']}],
    
    fire : function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('Ты потопил корабль!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMessage('Ты промазал!');
        view.displayMiss(guess);
        return false;
    },

    isSunk : function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            } 
        }
        return true;
    },

    generateShipLocations : function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip : function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            // Сгенерировать начальную поз. для горизонт. корабля
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            //Сгенерировать начальную поз. для верт. корабля
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize)
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //Добавить в массив для гориз. корабля
                newShipLocations.push(row + '' + (col + i));
            } else {
                //Добавить в массив для верт. корабля
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },

    collision : function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

// Реализация контроллера 
// Получение и обработка выстрела
//Отсл. кол-ва выстрелов
//Запрос к модели на обновление с посл выстр
// проверка завершения игры

var controller = {
    guesses : 0,
    processGuess : function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('Ты потопил все корабли за ' + this.guesses + ' попытки');
            }
        }

    }
};
function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    if (guess === null || guess.length !== 2) {
        alert('Введите букву и число на доске!')
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        
        if (isNaN(row) || isNaN(column)) {
            alert('Это не число с доски!');
        } else if (row < 0 || row >= model.boardSize || column < 0 
            || column >= model.boardSize) {
            alert('Это за пределами доски');
        } else {
            return row + column;
            
        } 
    }
    return null;
}


function unit() {
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleKeyPress(e) {
    var fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
}
window.onload = unit;