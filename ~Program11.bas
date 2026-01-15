init:
		clrf		PORTA
		clrf		PORTB
		bsf		STATUS,RP0
		movlw 	b'11111111'
		movwf		TRISA
		movlw		b'00000000'
		movwf		TRISB
temp		EQU		B10
main:
		clrf		PORTB
		movf		PORTA,W
		andlw		b'00000010'
		btfss		STATUS,Z
		goto		task1
		
		movf		PORTA,W
		andlw		b'00000100'
		btfss		STATUS,Z
		goto		task2
		goto		main
task1:		
		bsf		PORTB,1
		call		wait1000ms
		call		wait1000ms
		bsf		PORTB,1
		call		wait1000ms
		goto		main

task2:
		clrf		temp
		goto		test

test:
		movf		temp,W
		sublw		4
		btfsc		STATUS,Z
		goto		main
		bsf		PORTB,3
		call		wait100ms
		bcf		PORTB,3
		call		wait100ms
		incf		temp,F
		goto		test