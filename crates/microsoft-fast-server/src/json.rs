use std::collections::HashMap;

#[derive(Debug, Clone)]
pub enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<JsonValue>),
    Object(HashMap<String, JsonValue>),
}

impl JsonValue {
    pub fn is_truthy(&self) -> bool {
        match self {
            JsonValue::Null => false,
            JsonValue::Bool(b) => *b,
            JsonValue::Number(n) => *n != 0.0,
            JsonValue::String(s) => !s.is_empty(),
            JsonValue::Array(a) => !a.is_empty(),
            JsonValue::Object(_) => true,
        }
    }

    pub fn to_display_string(&self) -> String {
        match self {
            JsonValue::Null => String::new(),
            JsonValue::Bool(b) => b.to_string(),
            JsonValue::Number(n) => {
                if *n == n.floor() && n.abs() < 1e15 {
                    format!("{}", *n as i64)
                } else {
                    format!("{}", n)
                }
            }
            JsonValue::String(s) => s.clone(),
            JsonValue::Array(_) => "[Array]".to_string(),
            JsonValue::Object(_) => "[Object]".to_string(),
        }
    }
}

#[derive(Debug)]
pub struct JsonError {
    pub message: String,
}

impl std::fmt::Display for JsonError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "JsonError: {}", self.message)
    }
}

impl std::error::Error for JsonError {}

pub fn parse(input: &str) -> Result<JsonValue, JsonError> {
    let input = input.trim();
    let (value, rest) = parse_value(input)?;
    let rest = rest.trim();
    if !rest.is_empty() {
        return Err(JsonError { message: format!("Unexpected trailing content: {}", rest) });
    }
    Ok(value)
}

fn parse_value(input: &str) -> Result<(JsonValue, &str), JsonError> {
    let input = input.trim_start();
    if input.is_empty() {
        return Err(JsonError { message: "Unexpected end of input".to_string() });
    }
    match input.chars().next().unwrap() {
        '{' => parse_object(input),
        '[' => parse_array(input),
        '"' => {
            let (s, rest) = parse_string(input)?;
            Ok((JsonValue::String(s), rest))
        }
        't' => {
            if input.starts_with("true") {
                Ok((JsonValue::Bool(true), &input[4..]))
            } else {
                Err(JsonError { message: format!("Invalid token: {}", &input[..input.len().min(10)]) })
            }
        }
        'f' => {
            if input.starts_with("false") {
                Ok((JsonValue::Bool(false), &input[5..]))
            } else {
                Err(JsonError { message: format!("Invalid token: {}", &input[..input.len().min(10)]) })
            }
        }
        'n' => {
            if input.starts_with("null") {
                Ok((JsonValue::Null, &input[4..]))
            } else {
                Err(JsonError { message: format!("Invalid token: {}", &input[..input.len().min(10)]) })
            }
        }
        c if c == '-' || c.is_ascii_digit() => parse_number(input),
        c => Err(JsonError { message: format!("Unexpected character: '{}'", c) }),
    }
}

fn parse_object(input: &str) -> Result<(JsonValue, &str), JsonError> {
    let input = input.trim_start();
    if !input.starts_with('{') {
        return Err(JsonError { message: "Expected '{'".to_string() });
    }
    let mut rest = input[1..].trim_start();
    let mut map = HashMap::new();
    if rest.starts_with('}') {
        return Ok((JsonValue::Object(map), &rest[1..]));
    }
    loop {
        rest = rest.trim_start();
        let (key, after_key) = parse_string(rest)?;
        rest = after_key.trim_start();
        if !rest.starts_with(':') {
            return Err(JsonError { message: "Expected ':'".to_string() });
        }
        rest = rest[1..].trim_start();
        let (value, after_value) = parse_value(rest)?;
        map.insert(key, value);
        rest = after_value.trim_start();
        match rest.chars().next() {
            Some(',') => { rest = rest[1..].trim_start(); }
            Some('}') => { return Ok((JsonValue::Object(map), &rest[1..])); }
            _ => return Err(JsonError { message: "Expected ',' or '}'".to_string() }),
        }
    }
}

fn parse_array(input: &str) -> Result<(JsonValue, &str), JsonError> {
    let input = input.trim_start();
    if !input.starts_with('[') {
        return Err(JsonError { message: "Expected '['".to_string() });
    }
    let mut rest = input[1..].trim_start();
    let mut arr = Vec::new();
    if rest.starts_with(']') {
        return Ok((JsonValue::Array(arr), &rest[1..]));
    }
    loop {
        rest = rest.trim_start();
        let (value, after_value) = parse_value(rest)?;
        arr.push(value);
        rest = after_value.trim_start();
        match rest.chars().next() {
            Some(',') => { rest = rest[1..].trim_start(); }
            Some(']') => { return Ok((JsonValue::Array(arr), &rest[1..])); }
            _ => return Err(JsonError { message: "Expected ',' or ']'".to_string() }),
        }
    }
}

fn parse_string(input: &str) -> Result<(String, &str), JsonError> {
    if !input.starts_with('"') {
        return Err(JsonError { message: "Expected '\"'".to_string() });
    }
    let bytes = input.as_bytes();
    let mut i = 1;
    let mut s = String::new();
    while i < bytes.len() {
        match bytes[i] {
            b'"' => {
                return Ok((s, &input[i + 1..]));
            }
            b'\\' => {
                i += 1;
                if i >= bytes.len() {
                    return Err(JsonError { message: "Unexpected end of string escape".to_string() });
                }
                match bytes[i] {
                    b'"' => s.push('"'),
                    b'\\' => s.push('\\'),
                    b'/' => s.push('/'),
                    b'n' => s.push('\n'),
                    b't' => s.push('\t'),
                    b'r' => s.push('\r'),
                    b'b' => s.push('\x08'),
                    b'f' => s.push('\x0C'),
                    b'u' => {
                        if i + 4 >= bytes.len() {
                            return Err(JsonError { message: "Invalid unicode escape".to_string() });
                        }
                        let hex = &input[i + 1..i + 5];
                        let code_point = u32::from_str_radix(hex, 16).map_err(|_| JsonError {
                            message: format!("Invalid unicode escape: \\u{}", hex),
                        })?;
                        let ch = char::from_u32(code_point).ok_or_else(|| JsonError {
                            message: format!("Invalid unicode code point: {}", code_point),
                        })?;
                        s.push(ch);
                        i += 4;
                    }
                    c => {
                        return Err(JsonError { message: format!("Unknown escape sequence: \\{}", c as char) });
                    }
                }
                i += 1;
            }
            b => {
                s.push(b as char);
                i += 1;
            }
        }
    }
    Err(JsonError { message: "Unterminated string".to_string() })
}

fn parse_number(input: &str) -> Result<(JsonValue, &str), JsonError> {
    let bytes = input.as_bytes();
    let mut i = 0;
    if i < bytes.len() && bytes[i] == b'-' {
        i += 1;
    }
    while i < bytes.len() && bytes[i].is_ascii_digit() {
        i += 1;
    }
    if i < bytes.len() && bytes[i] == b'.' {
        i += 1;
        while i < bytes.len() && bytes[i].is_ascii_digit() {
            i += 1;
        }
    }
    if i < bytes.len() && (bytes[i] == b'e' || bytes[i] == b'E') {
        i += 1;
        if i < bytes.len() && (bytes[i] == b'+' || bytes[i] == b'-') {
            i += 1;
        }
        while i < bytes.len() && bytes[i].is_ascii_digit() {
            i += 1;
        }
    }
    let num_str = &input[..i];
    let n: f64 = num_str.parse().map_err(|_| JsonError {
        message: format!("Invalid number: {}", num_str),
    })?;
    Ok((JsonValue::Number(n), &input[i..]))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_object() {
        let v = parse(r#"{"name": "Alice", "age": 30}"#).unwrap();
        if let JsonValue::Object(map) = v {
            assert_eq!(map.get("name").unwrap().to_display_string(), "Alice");
            assert_eq!(map.get("age").unwrap().to_display_string(), "30");
        } else {
            panic!("Expected object");
        }
    }

    #[test]
    fn test_parse_array() {
        let v = parse(r#"[1, 2, 3]"#).unwrap();
        if let JsonValue::Array(arr) = v {
            assert_eq!(arr.len(), 3);
            assert_eq!(arr[0].to_display_string(), "1");
        } else {
            panic!("Expected array");
        }
    }

    #[test]
    fn test_parse_string_with_escapes() {
        let v = parse(r#""hello\nworld\t!""#).unwrap();
        if let JsonValue::String(s) = v {
            assert_eq!(s, "hello\nworld\t!");
        } else {
            panic!("Expected string");
        }
    }

    #[test]
    fn test_parse_number() {
        let v = parse("3.14").unwrap();
        if let JsonValue::Number(n) = v {
            assert!((n - 3.14).abs() < 1e-10);
        } else {
            panic!("Expected number");
        }
    }

    #[test]
    fn test_parse_bool() {
        assert!(matches!(parse("true").unwrap(), JsonValue::Bool(true)));
        assert!(matches!(parse("false").unwrap(), JsonValue::Bool(false)));
    }

    #[test]
    fn test_parse_null() {
        assert!(matches!(parse("null").unwrap(), JsonValue::Null));
    }
}
