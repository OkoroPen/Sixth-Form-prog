init:		
	clrf 		PORTA
	clrf 		PORTB
	bsf 		STATUS,RP0
	movlw 	b'00000000' 
	movwf		TRISB
	movlw		b'11111111'		;Sets all of PORTA as inputs
	movwf		TRISA
	bcf		STATUS,RP0
	
begin:
	btfss		PORTA,1		;test bit 1 of PORTA
	goto		begin		
	bsf		PORTB,0		;Sets the output  port B bit 0
	call		wait1000ms
	call		wait1000ms
	bcf		PORTB,0
	call		wait1000ms
	goto		begin