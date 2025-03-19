type File = {
    Body: Body
}
type Body = {
    Attributes: any,
    Blocks: Block[]
}
type Block = {
    Type: string,
    Labels: string,
    Body: Body,
    TypeRange: Range,
    LabelRanges: Range[],
    OpenBraceRange: Range,
    CloseBraceRange: Range,
    DefRange: Range,
}
type Range = {
    Filename: string,
    /**
     * Start and End represent the bounds of this range. Start is inclusive and End is exclusive.
     */
    Start: Pos,
    /**
     * Start and End represent the bounds of this range. Start is inclusive and End is exclusive.
     */
    End: Pos
}
type Pos = {
    /**
     * Line is the source code line where this position points.
     * Lines are counted starting at 1 and incremented for each newline character encountered.
     */
    Line: number

    /**
     Column is the source code column where this position points, in
     unicode characters, with counting starting at 1.

     Column counts characters as they appear visually, so for example a
     latin letter with a combining diacritic mark counts as one character.
     This is intended for rendering visual markers against source code in
     contexts where these diacritics would be rendered in a single character
     cell. Technically speaking, Column is counting grapheme clusters as
     used in unicode normalization.
     */
    Column: number

    /**
     Byte is the byte offset into the file where the indicated character
     begins. This is a zero-based offset to the first byte of the first
     UTF-8 codepoint sequence in the character, and thus gives a position
     that can be resolved _without_ awareness of Unicode characters.
     */
    Byte: number

}

export declare function parse(filename: string, content: string): Promise<File>;
