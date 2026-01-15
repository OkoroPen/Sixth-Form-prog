init:
	clrf		PORTA
	clrf		PORTB
	bsf		STATUS,RP0
	movlw 	b'11111111'
	movwf		TRISA
	movlw		b'00000000'
	movwf		TRISB
main:	
	clrf		PORTA
	clrf		PORTB
	bsf		PORTB,0
	call		wait100ms
	bcf		PORTB,0
	call		wait100ms
	bcf		STATUS,Z
	movf		PORTA,W
	sublw		5
	btfss		STATUS,Z
	
	goto		main	
	goto		open
open:
	bsf		PORTB,1
	call		wait1000ms
	call		wait1000ms
	call		wait1000ms
	goto		main
	
	