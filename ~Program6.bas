init:
	clrf		PORTA
	clrf		PORTB
	bsf		STATUS,RP0
	movlw 	b'11111111'
	movwf		TRISA
	movlw		b'00000000'
	movwf		TRISB
hold  EQU		B10

Test:
	movf		PORTA,W
	movwf		PORTB
	movlw		d'8'
	movwf		hold
	
Again:
	call		wait100ms
	decfsz	hold,F
	
	goto		Again
	goto		Test