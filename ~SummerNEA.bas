init:
	clrf     	PORTA                ; Clear PORTA
    	clrf     	PORTB                ; Clear PORTB
    	bsf      	STATUS, RP0          ; Switch to Bank 1
    	movlw    	b'00000101'          ; Set RA1 and RA2 as inputs (others as outputs)
    	movwf    	TRISA
    	movlw    	b'00000000'          ; All PORTB as outputs
    	movwf    	TRISB
    	bcf      	STATUS, RP0          ; Return to Bank 0
lightLevel      EQU     B10    
flash           EQU     B0  

main_loop:
    	call		readadc0
	movf		B0,W
	sublw		d'128'		   ; Compare lightLevel with 128
      btfss    	STATUS, C            ; Skip next if W < 128 (light level < threshold)
	call		NightMode
buttonpress:			         ; Check Button Press
    	btfss    	PORTA, 2             ; Check if button on RA2 is pressed
    	goto     	NormalCycle 
    	call     	PedestrianCrossing
NormalCycle:                            ; Normal Traffic Light Cycle
    	bcf     	PORTB, 1              ; Amber OFF
    	bsf     	PORTB, 0              ; Red ON (10s)
   	call		delay5s
	call		delay5s
    	bcf     	PORTB, 2              ; Green OFF
    	bsf     	PORTB, 1              ; Amber ON (5s)
    	call		delay5s
    	bsf     	PORTB, 2              ; Green ON (15s)
    	bcf     	PORTB, 1              ; Amber OFF
    	bcf     	PORTB, 0              ; Red OFF
    	call		delay5s
	call		delay5s
	call		delay5s
    	bcf     	PORTB, 2              ; Green OFF
    	bsf     	PORTB, 1              ; Amber ON (5s)
    	call		delay5s
    	bcf     	PORTB, 1              ; Amber OFF
    	bsf     	PORTB, 0              ; Red ON (10s)
    	call		delay5s
	call		delay5s
    	btfsc   	PORTA, 2              ; Check again for button press
    	call    	PedestrianCrossing
    	goto    	main_loop
PedestrianCrossing:			    ; Pedestrian Crossing Routine
    	bcf     	PORTB, 2              ; Green Traffic Light OFF
    	bsf     	PORTB, 1              ; Amber ON (5s)
    	bcf     	PORTB, 0              ; Red OFF
    	call		delay5s
    	bcf     	PORTB, 3              ; Pedestrian Red OFF
    	bcf     	PORTB, 1              ; Amber OFF
    	bsf     	PORTB, 0              ; Red ON
    	movlw   	7			    ; Flash Pedestrian Green light for 7 seconds (7 flashes)
    	movwf   	flash
    	call    	flashPedGreen
    	bcf     	PORTB, 4              ; Pedestrian Green OFF
    	bsf     	PORTB, 3              ; Pedestrian Red ON
    	return	
flashPedGreen:
flashPedLoop:				   ; Flash Pedestrian Green Light (ON/OFF flashing)
    	bsf     	PORTB, 4             ; Pedestrian Green ON
    	call    	wait100ms
    	call    	wait100ms
   	call    	wait100ms
    	call    	wait100ms
    	call    	wait100ms
    	bcf     	PORTB, 4             ; Pedestrian Green OFF
    	call    	wait100ms
    	call    	wait100ms
   	call    	wait100ms
    	call    	wait100ms
    	call    	wait100ms
    	decfsz  	flash, f
    	goto    	flashPedLoop
	goto        main_loop
    return
NightMode:					 
    movlw   	5			    ; Flash Pedestrian Amber light for 5 seconds (5 flashes)
    movwf   	flash
    call          NightFlashingAmber
    goto		buttonpress
    return
 NightFlashingAmber:
      bsf     	PORTB, 1           ; Pedestrian Amber ON
    	call    	wait100ms
    	call    	wait100ms
   	call    	wait100ms
    	call    	wait100ms
    	call    	wait100ms
    	bcf     	PORTB, 1             ; Pedestrian Amber OFF
    	call    	wait100ms
    	call    	wait100ms
   	call    	wait100ms
    	call    	wait100ms
    	call    	wait100ms
    	decfsz  	flash, f
    	goto    	NightFlashingAmber
   return
delay5s:
	call	  	wait1000ms
    	call	  	wait1000ms
    	call	  	wait1000ms
    	call	  	wait1000ms
    	call	  	wait1000ms
return