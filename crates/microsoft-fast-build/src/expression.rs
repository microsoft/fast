pub(crate) fn find_binary_op(expr: &str, op: &str) -> Option<usize> {
    let bytes = expr.as_bytes();
    let op_bytes = op.as_bytes();
    let mut i = 0;
    while i + op_bytes.len() <= bytes.len() {
        if &bytes[i..i + op_bytes.len()] == op_bytes {
            return Some(i);
        }
        i += 1;
    }
    None
}

pub(crate) fn find_comparison_op(expr: &str, op: &str) -> Option<usize> {
    let bytes = expr.as_bytes();
    let op_bytes = op.as_bytes();
    let mut i = 0;
    while i + op_bytes.len() <= bytes.len() {
        if &bytes[i..i + op_bytes.len()] == op_bytes {
            // For single-char < or >, ensure the next char is not `=` to avoid
            // matching the first character of `<=` / `>=`.
            if op_bytes.len() == 1
                && (op_bytes[0] == b'>' || op_bytes[0] == b'<')
                && bytes.get(i + 1) == Some(&b'=')
            {
                i += 1;
                continue;
            }
            return Some(i);
        }
        i += 1;
    }
    None
}
