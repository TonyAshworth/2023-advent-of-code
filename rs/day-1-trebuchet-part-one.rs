#![allow(unused)]
use std::fs::File;
use std::io::Read;

fn read_file() -> Vec<String> {
    let mut file = File::open("../resources/day-1-calibration.txt").expect("File not found");
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect("Error reading file");
    contents.lines().map(|s| s.to_string()).collect()
}

fn first_digit(it: impl Iterator<Item = char>) -> i32 {
    it.map(|c| c.to_digit(10)).flatten().next().unwrap() as i32
}

fn main() {
    let data = read_file();
    let ans = data
        .map(|line| first_digit(line.chars()) * 10 + first_digit(line.chars().rev()))
        .sum::<i32>();
    println!("{ans}");
}
