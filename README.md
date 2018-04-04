# chesstactoe

# FEATURES 


LANDING PAGE   
	-> Basically copy generals.io  
	-> Set username  
		-> If not, we'll just save locally your anonymous ID from FB  
		-> If you set it, obviously we'll attach that name  
	-> Join Game  
		-> Matchmaking  
		-> Private  

STACK  
	-> Angular5/Ionic3  
	-> Firebase/Firestore  
	-> Auto deploy from Github to Heroku  
 
GAMEPLAY  
	-> 4x4 board with 1x4 rows on either side to hold your pieces  
	-> Client-side validation for making moves  
	-> Client-side winner determination  
	-> Launch modal "You Lost/Won!"  
		-> New Game  
		-> Watch Replay  
		-> Go Home  

REPLAYS  
	-> Store every move ever and play back at maybe 500ms  
		-> Make this experience similar to generals.io  

# OPTIONAL FEATURES  

LEADERBOARD  
	-> Based on Elo  
	-> Links to usernames to watch replays  

CHATROOM  
	->  

DUMMY AI  
	-> Makes random moves  
	-> Could make it smarter if we get bored  

# DATABASE DESIGN 

{  
	playerQueue: {  
		// every player in the queue just has their id, we need nothing else  
		// perhaps store ELO for better matchmaking  
		1: {  
			id: 1  
		}  
	},  
	users: {  
		1: {  
			id: 1,  
			username: 'Matticus',  
			elo: 1200  
			games: {  
				1: {  
					gameId: 12  
				},  
				1: {  
					gameId: 18  
				}  
			}  
		}  
	},  
	games: {  
		12: {  
			players: {  
				1: {  
					playerID: 1,  
					elo: 1200  
					color: 'white'  
				},  
				2: {  
					playerID: 7,  
					elo: 1200  
					color: 'black'  
				}  
			},  
			// the format of a move is 3 characters  
			// 1 - piece, 2 - column, 3 - row  
			turns: {  
				1: {  
					playerId: 1,  
					move: 'rb4'  
				},  
				2: {  
					playerId: 7,  
					move: 'ka2'  
				}  
			},  
			outcomes: {  
				winnerId: 7,  
				eloChange: 3  
			},  
			// this should be created by server when game starts  
			timestamp: 1323225212  
		}  
	}  
}  
