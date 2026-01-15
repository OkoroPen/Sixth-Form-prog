init:
	

main:
	movf		PORTA,W
	movwf		PORTB
	call		wait1000ms	call		wait1000ms
	goto		main
	