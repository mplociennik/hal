#include <Servo.h>

Servo servo_one;  // create servo object to control a servo
Servo servo_two;  // create servo object to control a servo
// twelve servo objects can be created on most boards
int pos = 0;    // variable to store the servo position
// servos
const int servo_one_pin = 0;
//const int servo_two_pin = 1;
// Motor A [Right Side]
const int enA = 4;
const int in1 = 8;
const int in2 = 9;
// Motor B [Left Side]
const int enB = 6;
const int in3 = 10;
const int in4 = 11;

boolean packetEnded = false;
boolean backward = false;
int steps = 0;

void setup() {
  //Serial
  Serial.begin(9600);
  //set servo pins
  //servo_one.attach(servo_one_pin);
  //servo_two.attach(servo_two_pin);  
  // set all the motor control pins to outputs
  pinMode(enA, OUTPUT);
  pinMode(enB, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);
}

void move_servo(Servo servo){
  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    servo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    servo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
}

void moveForward(int speed)
{
  analogWrite(enA, speed);
  analogWrite(enB, speed);
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);
  digitalWrite(in3, HIGH);
  digitalWrite(in4, LOW);
}

void moveBackwards(int speed)
{
  analogWrite(enA, speed);
  analogWrite(enB, speed);
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);
  digitalWrite(in3, LOW);
  digitalWrite(in4, HIGH);
}

void moveRight(int speed)
{
  analogWrite(enA, speed);
  analogWrite(enB, speed);
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
  digitalWrite(in3, HIGH);
  digitalWrite(in4, LOW);
}

void moveLeft(int speed)
{
  analogWrite(enA, speed);
  analogWrite(enB, speed);
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);
  digitalWrite(in3, LOW);
  digitalWrite(in4, LOW);
}

void moveStop()
{
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);  
  digitalWrite(in3, LOW);
  digitalWrite(in4, LOW);
  delay(200);
}

void run_command(char command){
  Serial.println("command:");
  Serial.println(command);
  switch(command){
    case '1':
        moveForward(255);  
    case '2':
        moveBackwards(255);
        break;
    case '3':
        moveLeft(255);
        break;
    case '4':
        moveRight(255);
        break;
    case '0':
        moveStop();
        break;
    default:
       printf('yolo');       
  }
}

void loop() {
  while(Serial.available() > 0){
    //Read each character, check if negative, end of command or
    //digit, and adjust step value accordingly
    char aChar = Serial.read();
    if(aChar == '-'){
      backward = true;
    }
    else if(aChar == ';'){
      packetEnded = true;
    }
    else if(aChar >= '0' && aChar <= '9'){
      steps *= 10;
      steps += aChar -'0';
    }
  }
  
  if(packetEnded){
    //Perform steps
    if(backward){
      Serial.print(steps);
      Serial.println(" Steps Backward");
      //func here
    }
    else{
      Serial.print(steps);
      Serial.println(" Steps Forward");
      //func here
    }
    
    //Reset control values.
    steps = 0;
    backward = false;
    packetEnded = false;
  }
}
