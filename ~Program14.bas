init:
	clrf		PORTA
	clrf		PORTB
	bsf		STATUS,RP0
	movlw 	b'11111111'
	movwf		TRISA
	movlw		b'00000000'
	movwf		TRISB
	bcf		STATUS, RP0
	temp 		EQU B10

main:
	call		readadc0		;readadc A.0 into register B0
	movf		B0,W			;move register B0  to working memory	
	movwf		PORTB			;display working memory on port B
	movlw		3
	movwf		temp
	call 		later
	btfss	PORTB,7			;is light > 127(note this tests one bit to see if its higher or lower 
	goto		main			;if not loop back
	bsf		PORTA,1		;set indicator A1 to indicate high light
	movlw		6
	movwf 	temp
	goto 		later
	bcf		PORTA,1
	goto 		main		
later:
	call		wait100ms
	decfsz	temp,F
	call		later
	bcf		STATUS,Z
	return