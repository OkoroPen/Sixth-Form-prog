init:
		clrf		PORTA
		clrf		PORTB
		bsf		STATUS,RP0
		movlw 	b'11111111'
		movwf		TRISA
		movlw		b'00000000'
		movwf		TRISB
score  	EQU		B10

again:
		movlw		b'00000000'		;clears working register
		clrf		score			;clear score
		clrf		PORTB			;clears PORTB
		
penalty:
		btfsc		PORTA,5		;tests A5 for resets
		goto		again			;game over and resets
		btfss		PORTA,0
		goto		try
		movf		score,W
		addlw		d'3'
		movwf		score
		movwf		PORTB
		call		wait1000ms		
		goto		penalty

try: