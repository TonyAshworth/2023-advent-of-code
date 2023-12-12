use std::fs::File;
use std::io::{self, BufRead};

fn main() {
    let lines = read_file_lines("resources/day-5-input-sample.txt").unwrap();
    let (array1, array3) = parse_strings(&lines);

    println!("array1: {:?}", array1);

    for map in &array3 {
        println!("Map {:?}", map);
        println!("Map Name: {}", map.map_name);
        println!("Map Beginning: {}", map.map_beginning);
        println!("Map Ending Offset: {}", map.map_ending_offset);
        println!("Map To Beginning: {}", map.map_to_beginning);
        println!();
    }
}

fn read_file_lines(file_path: &str) -> io::Result<Vec<String>> {
    let file = File::open(file_path)?;
    let reader = io::BufReader::new(file);
    let mut lines = Vec::new();

    for line in reader.lines() {
        lines.push(line?);
    }

    Ok(lines)
}

#[derive(Debug)]
struct Map {
    map_name: String,
    map_beginning: u32,
    map_ending_offset: u32,
    map_to_beginning: u32,
}

fn parse_strings(strings: &[String]) -> (Vec<String>, Vec<Map>) {
    let mut array1 = Vec::new();
    let mut array3 = Vec::new();

    let mut index = 0;
    let mut map_name = "";

    for string in strings {
        if string.is_empty() {
            continue;
        } else if string.contains("seeds:") {
            array1.push(string.clone());
        } else if string.ends_with("map:") {
            index = index + 1;
            let temp = string.split(" ").collect::<Vec<&str>>();
            map_name = temp[2]
                .split('-')
                .last()
                .unwrap()
                .split(' ')
                .next()
                .unwrap();
        } else {
            let map_parts = string.split(" ").collect::<Vec<&str>>();
            let new_map = Map {
                map_name: map_name.to_string(),
                map_beginning: map_parts[1].parse::<u32>().unwrap(),
                map_ending_offset: map_parts[2].parse::<u32>().unwrap(),
                map_to_beginning: map_parts[0].parse::<u32>().unwrap(),
            };
            array3.push(new_map);
        }
    }

    (array1, array3)
}
