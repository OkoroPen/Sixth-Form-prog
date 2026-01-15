init:
		clrf		PORTA
		clrf		PORTB
		bsf		STATUS,RP0
		movlw 	b'11111111'
		movwf		TRISA
		movlw		b'00000000'
		movwf		TRISB
newbox:
		clrf		PORTA
		clrf		PORTB
		movlw		12
		movwf		PORTB
	
test:
		btfss		PORTA,0
		goto		test		
		call		wait100ms		
		decfsz	PORTB,F
		goto		test		
		bsf		PORTB,7
		call		wait100ms
		call		wait100ms		
		call		wait100ms
		goto		newbox