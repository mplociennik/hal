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

char receivedChar;
boolean newData = false;

void setup() {
  //Serial
  Serial.begin(115200);
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

void run_command(char* command){
  if(command[0] == '1') {
    Serial.println(String('1a'));
    moveForward(255);
  }
  if(command[0] == '2') moveBackwards(255);
  if(command[0] =='3') moveLeft(255);       
  if(command[0] == '4') moveRight(255);
  if(command[0] == '0') moveStop();   
}

void loop() {
  if(Serial.available() > 0) {
    char data = Serial.read();
    char str[2];
    str[0] = data;
    str[1] = '\0';
    run_command(str);
  }
}
