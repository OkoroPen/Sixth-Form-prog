init:
		clrf		PORTA
		clrf		PORTB
		bsf		STATUS,RP0
		movlw 	b'11111111'
		movwf		TRISA
		movlw		b'00000000'
		movwf		TRISB
		W_SAVE	EQU		B10
seq1:
		clrf		PORTB
		movlw		b'10101010'		;set up LED pattern
		movwf		TRISB			;set up pattern to PORTB
		call		wait100ms		;delay 100 milliseconds
		call		wait100ms		;delay 100 milliseconds
		goto		seq1

interrupt: 
		movwf		W_SAVE		;copy W to save register
		btfss		INTCON,INT01F	;check correct interrupt occured
		retfie				;no, so return and reenable GIE
		goto		seq2

seq2:	
		clrf		PORTB
		bsf		PORTB,2
		call		100ms
		
	
leave:
		bcf		INTCON		;clear interrupt flag
		movf		W_SAVE,W		;restore working memory
		retfie				;return and reset GIE bit