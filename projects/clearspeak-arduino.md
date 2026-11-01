# CLEARSPEAK Arduino Controller

## Overview
The dedicated Arduino subsystem for the CLEARSPEAK thesis project. This microcontroller handles critical hardware control, battery monitoring, and safe communication with the Raspberry Pi through optocoupler isolation. It serves as the bridge between physical hardware and the main processing unit.

## Project Type
**Thesis Component** — Hardware Control Module for CLEARSPEAK

## Purpose
Manages real-time hardware operations including button input, sensor readings, and voltage monitoring while protecting the main Raspberry Pi processor from electrical surge damage through isolated communication.

## Key Features
- **Optocoupler Isolation**: Galvanic isolation between Arduino and Raspberry Pi to prevent surge damage
- **Button Control**: Manages user input buttons for system control and configuration
- **Battery Voltage Monitoring**: Continuously monitors battery voltage levels
- **Shutdown Prevention**: Intelligently triggers safe Raspberry Pi shutdown before complete battery drain
- **Sensor Interface**: Reads voltage directly from battery connection
- **Power Management**: Ensures graceful system shutdown to prevent data corruption and sudden power loss
- **Real-time Communication**: Communicates voltage status and button states to Raspberry Pi via isolated serial connection

## Technical Stack
**Languages & Frameworks:**
- C/C++ (Arduino firmware)

**Hardware Components:**
- Arduino microcontroller (Uno, Nano, or similar)
- Optocoupler module (4N35 or equivalent) for isolation
- Battery voltage divider circuit
- Button switches for user input
- Analog-to-digital converter (ADC) for voltage sensing
- Serial communication interface
- Supporting resistors and capacitors

**Communication Protocol:**
- Isolated serial communication via optocoupler
- Voltage threshold detection
- Button state transmission
- Shutdown signal generation

## Voltage Monitoring Logic
- **Critical Threshold**: Detects when battery voltage drops below safe operating level
- **Warning Signal**: Alerts Raspberry Pi with shutdown command
- **Graceful Shutdown**: Allows proper system termination instead of abrupt power loss
- **System Logging**: Enables clean shutdown procedures and data preservation

## Button Functions
- Power on/off control
- Mode selection
- Configuration adjustments
- Emergency shutdown activation

## Safety Features
- **Surge Protection**: Optocoupler provides electrical isolation preventing voltage spikes from damaging Raspberry Pi
- **Battery Saver**: Prevents over-discharge of battery
- **Safe Shutdown**: Ensures Raspberry Pi completes all processes before power cut
- **Voltage Monitoring**: Continuous real-time battery health tracking

## Integration with CLEARSPEAK
- Part of the complete CLEARSPEAK wearable system
- Enables portable, battery-powered operation
- Protects expensive Raspberry Pi hardware
- Ensures reliable thesis project performance

## Learning Outcomes
This component demonstrates:
- Microcontroller programming and real-time control
- Electrical isolation techniques and optocoupler usage
- Battery management and power monitoring
- Inter-processor communication protocols
- Hardware protection design principles
- System-level reliability engineering

## Challenges Solved
- Preventing electrical damage from battery surges
- Reliable battery voltage monitoring
- Safe shutdown sequence without data loss
- Real-time button responsiveness
- Isolated communication without ground loops

---

**Status**: Completed (Thesis Component)  
**Year**: 2026  
**Integration**: Core hardware control module for CLEARSPEAK thesis project
