const sqlDb = require('../config/db');

// Define 3 Major Difficulty Levels
const levelsData = [
  {
    id: 'beginner',
    title: 'Beginner: Java Foundations',
    description: 'Master Java syntax, keywords, variables, control flow, loops, and beginner sorting challenges.',
    color_theme: 'emerald',
    order_index: 1
  },
  {
    id: 'moderate',
    title: 'Moderate: Object-Oriented Mastery',
    description: 'Conquer classes, inheritance, polymorphism, encapsulation, interfaces, and exception handling.',
    color_theme: 'violet',
    order_index: 2
  },
  {
    id: 'advanced',
    title: 'Advanced: Enterprise, Streams & Threads',
    description: 'Master the Java Collections Framework, Streams API, Lambdas, Multithreading, and JVM internals.',
    color_theme: 'rose',
    order_index: 3
  }
];

// Define 36 Sublevels (12 per level)
const sublevelsData = [
  // Beginner (1-12)
  { level_id: 'beginner', sublevel_number: 1, title: 'JVM, JRE, JDK & Architecture', description: 'Bytecode, javac compiler, JVM execution and platform independence.', icon: '☕' },
  { level_id: 'beginner', sublevel_number: 2, title: 'Main Method & Case Sensitivity', description: 'public static void main, case-sensitive keywords, and structure.', icon: '🔑' },
  { level_id: 'beginner', sublevel_number: 3, title: 'Primitive Data Types & Literals', description: 'byte, short, int, long, float, double, char, and boolean.', icon: '📦' },
  { level_id: 'beginner', sublevel_number: 4, title: 'Variables & Semicolon Rules', description: 'Declaration, initialization, semicolon termination, and naming rules.', icon: '📝' },
  { level_id: 'beginner', sublevel_number: 5, title: 'Arithmetic & Assignment Operators', description: '+, -, *, /, %, +=, -= and operator precedence in Java.', icon: '➕' },
  { level_id: 'beginner', sublevel_number: 6, title: 'Increment & Decrement Wizards', description: 'Prefix vs Postfix (++x, x++, --y) and evaluation order.', icon: '⚡' },
  { level_id: 'beginner', sublevel_number: 7, title: 'Relational & Logical Operators', description: '== vs =, !=, <, >, &&, ||, ! and truth evaluation.', icon: '⚖️' },
  { level_id: 'beginner', sublevel_number: 8, title: 'Conditional Branching: if-else', description: 'if, else if, else conditions, boolean checks, and code blocks.', icon: '🔀' },
  { level_id: 'beginner', sublevel_number: 9, title: 'The switch-case Statement', description: 'switch, case, break, default, and fallthrough behavior.', icon: '🔘' },
  { level_id: 'beginner', sublevel_number: 10, title: 'For Loop Syntax & Iterations', description: 'Initialization, condition, step, and nested loop patterns.', icon: '🔄' },
  { level_id: 'beginner', sublevel_number: 11, title: 'While & Do-While Loops', description: 'Entry-controlled vs exit-controlled loops and termination conditions.', icon: '🔁' },
  { level_id: 'beginner', sublevel_number: 12, title: 'Beginner Capstone: 1D Arrays & Methods', description: 'Array declaration, indexing, length attribute, and method calls.', icon: '🏆' },

  // Moderate (13-24)
  { level_id: 'moderate', sublevel_number: 13, title: 'Classes, Objects & new Keyword', description: 'Class blueprints, object instantiation, and instance variables.', icon: '🏗️' },
  { level_id: 'moderate', sublevel_number: 14, title: 'Constructors & this Keyword', description: 'Default vs parameterized constructors, this() constructor calls.', icon: '🎯' },
  { level_id: 'moderate', sublevel_number: 15, title: 'Access Modifiers & Scope', description: 'public, protected, default (package-private), and private.', icon: '🛡️' },
  { level_id: 'moderate', sublevel_number: 16, title: 'Encapsulation & JavaBean Rules', description: 'Private fields, standard getters and setters, data protection.', icon: '🔒' },
  { level_id: 'moderate', sublevel_number: 17, title: 'Inheritance with extends & super', description: 'Subclassing, IS-A relationships, super() calls and super fields.', icon: '🧬' },
  { level_id: 'moderate', sublevel_number: 18, title: 'Method Overloading vs Overriding', description: '@Override, method signature differences, and runtime dispatch.', icon: '🎭' },
  { level_id: 'moderate', sublevel_number: 19, title: 'Polymorphism & Type Casting', description: 'Upcasting, downcasting, instanceof operator, and dynamic dispatch.', icon: '✨' },
  { level_id: 'moderate', sublevel_number: 20, title: 'Abstract Classes & Methods', description: 'abstract keyword, bodyless methods, partial implementation.', icon: '📐' },
  { level_id: 'moderate', sublevel_number: 21, title: 'Interfaces & implements Keyword', description: 'Multiple inheritance of type, default methods, and static methods.', icon: '🔌' },
  { level_id: 'moderate', sublevel_number: 22, title: 'Exception Handling: try-catch-finally', description: 'Handling runtime errors, catch hierarchy, finally execution.', icon: '🧯' },
  { level_id: 'moderate', sublevel_number: 23, title: 'Throwing Exceptions: throw vs throws', description: 'Checked vs unchecked exceptions, custom exception classes.', icon: '💥' },
  { level_id: 'moderate', sublevel_number: 24, title: 'Moderate Capstone: Strings & Wrappers', description: 'String pool, immutability, StringBuilder, and autoboxing.', icon: '💎' },

  // Advanced (25-36)
  { level_id: 'advanced', sublevel_number: 25, title: 'Collections: List & ArrayList', description: 'Dynamic arrays, size vs length, List interface operations.', icon: '📋' },
  { level_id: 'advanced', sublevel_number: 26, title: 'Collections: LinkedList & Queue', description: 'Doubly-linked nodes, FIFO queues, poll(), peek(), and offer().', icon: '🔗' },
  { level_id: 'advanced', sublevel_number: 27, title: 'Collections: Set, HashSet & TreeSet', description: 'Unique elements, hashCode(), equals(), and sorted sets.', icon: '🌲' },
  { level_id: 'advanced', sublevel_number: 28, title: 'Collections: Map & HashMap Internals', description: 'Key-value pairs, buckets, hash collisions, entrySet() iteration.', icon: '🗺️' },
  { level_id: 'advanced', sublevel_number: 29, title: 'Java Generics & Wildcards', description: '<T>, unbounded <?> wildcards, extends and super bounds.', icon: '🧩' },
  { level_id: 'advanced', sublevel_number: 30, title: 'Lambda Expressions & Functional Interfaces', description: 'Syntax: (args) -> body, @FunctionalInterface, and method references.', icon: '🏹' },
  { level_id: 'advanced', sublevel_number: 31, title: 'Streams API: Filter & Map Pipelines', description: 'Intermediate operations, filtering, mapping, and method references.', icon: '🌊' },
  { level_id: 'advanced', sublevel_number: 32, title: 'Streams API: Reductions & Collectors', description: 'Terminal operations, collect(toList()), reduce(), groupingBy().', icon: '🧪' },
  { level_id: 'advanced', sublevel_number: 33, title: 'Multithreading: Thread & Runnable', description: 'Thread lifecycle, start() vs run(), creating concurrent tasks.', icon: '🧵' },
  { level_id: 'advanced', sublevel_number: 34, title: 'Synchronization & Concurrency Locks', description: 'synchronized blocks, race conditions, volatile, and deadlock prevention.', icon: '🔐' },
  { level_id: 'advanced', sublevel_number: 35, title: 'Java File I/O & Try-With-Resources', description: 'BufferedReader, Scanner, AutoCloseable, and modern NIO.2.', icon: '📁' },
  { level_id: 'advanced', sublevel_number: 36, title: 'Advanced Master Capstone: JVM & GC', description: 'Heap, Stack, Metaspace, Garbage Collection roots, and memory leaks.', icon: '👑' }
];

/**
 * Generates 15 high-quality, pedagogical Java questions for a specific sublevel.
 * Each sublevel gets:
 * - 4-5 Sorting / Reordering questions (with real Java code tokens)
 * - 3-4 Case-sensitivity / Syntax fix questions (spotting 'Public', 'Void', 'Static', 'Int', etc.)
 * - 6-8 Output prediction, MCQ, and Bug hunter questions
 */
function generateQuestionsForSublevel(sublevelId, sublevelNumber, title, levelId) {
  const questions = [];

  // Helper to push question
  const addQ = (type, prompt, code, options, correct, explanation, threat) => {
    questions.push({
      sublevel_id: sublevelId,
      question_index: questions.length + 1,
      question_type: type,
      prompt,
      code_snippet: code || null,
      options_json: JSON.stringify(options),
      correct_answer_json: typeof correct === 'object' ? JSON.stringify(correct) : String(correct),
      explanation,
      threat_hint: threat || 'Koffi says: Make a mistake and your streak is in grave danger! ☕'
    });
  };

  // Switch based on sublevelNumber (1 to 36)
  switch (sublevelNumber) {
    // -------------------------------------------------------------
    // SUBLEVEL 1: JVM, JRE, JDK & Architecture
    // -------------------------------------------------------------
    case 1:
      addQ('sorting', 'Rearrange the Java compilation and execution steps in the correct order:', null,
        ['Java Source (.java)', 'javac Compiler', 'Bytecode (.class)', 'JVM Execution'],
        ['Java Source (.java)', 'javac Compiler', 'Bytecode (.class)', 'JVM Execution'],
        'Java code starts as a .java source file, compiled by javac into .class bytecode, which is executed by the JVM.',
        'Koffi says: If you do not know the compilation flow, your code will never compile in my presence!'
      );
      addQ('case_fix', 'Which command is incorrectly capitalized for compiling Java source code?', 'Javac HelloWorld.java',
        ["Javac (should be lowercase 'javac')", 'HelloWorld (should be lowercase)', '.java (should be .JAVA)', 'No error'],
        "Javac (should be lowercase 'javac')",
        'The Java compiler command-line tool is lowercase "javac". Operating systems and shells are case-sensitive.',
        'Koffi says: Capitalizing javac?! Koffi is sharpening his tiny semicolon knife!'
      );
      addQ('mcq', 'What does WORA stand for in Java philosophy?', null,
        ['Write Once, Run Anywhere', 'Write Once, Read Always', 'Web Oriented Runtime Application', 'Windows Only Run Anywhere'],
        'Write Once, Run Anywhere',
        'Java achieved fame with the slogan "Write Once, Run Anywhere" thanks to the JVM converting bytecode on any platform.',
        'Koffi says: WORA also means: Fail Once, Get Threatened Everywhere by Koffi!'
      );
      addQ('sorting', 'Rearrange the architectural layers from developer code to machine hardware:', null,
        ['Source Code', 'Java Virtual Machine (JVM)', 'Operating System', 'Hardware CPU'],
        ['Source Code', 'Java Virtual Machine (JVM)', 'Operating System', 'Hardware CPU'],
        'Source code interacts with the JVM, which communicates with the host Operating System, running on the CPU.',
        'Koffi says: Get the layers wrong and Koffi will pull your CPU plug!'
      );
      addQ('case_fix', 'In Java file naming, how must the file name relate to the public class?', 'public class AppTest { }',
        ['File name must be AppTest.java (exact match)', 'File name can be apptest.java', 'File name does not matter', 'File name must be Apptest.JAVA'],
        'File name must be AppTest.java (exact match)',
        'In Java, a public class must reside in a file with the exact same name and casing, ending with .java.',
        'Koffi says: Case mismatch in filename = instant compilation catastrophe!'
      );
      addQ('mcq', 'Which component contains the JVM plus core libraries needed to RUN Java programs?', null,
        ['JRE (Java Runtime Environment)', 'JDK (Java Development Kit)', 'JVM standalone', 'Java API Documentation'],
        'JRE (Java Runtime Environment)',
        'JRE contains the JVM and runtime libraries needed to execute programs, whereas JDK contains the compiler tools as well.',
        'Koffi says: JRE runs your code, but Koffi runs your sleep schedule!'
      );
      addQ('sorting', 'Rearrange the JDK components hierarchy from largest to smallest containment:', null,
        ['JDK (Dev Kit)', 'JRE (Runtime)', 'JVM (Virtual Machine)', 'JIT Compiler'],
        ['JDK (Dev Kit)', 'JRE (Runtime)', 'JVM (Virtual Machine)', 'JIT Compiler'],
        'JDK contains the JRE, which contains the JVM, which contains the JIT (Just-In-Time) compiler.',
        'Koffi says: Hierarchy matters. Just remember Koffi is at the very top!'
      );
      addQ('mcq', 'What is the extension of compiled Java bytecode files?', null,
        ['.class', '.java', '.jvm', '.exe'],
        '.class',
        'The javac compiler produces .class files containing Java bytecode.',
        'Koffi says: If you do not see a .class file, you probably forgot a semicolon!'
      );
      addQ('case_fix', 'Which of the following file extensions has invalid casing for Java source code?', 'MyCode.Java',
        ['.Java (should be lowercase .java)', 'MyCode (should be lowercase)', 'Neither', 'Both are invalid'],
        '.Java (should be lowercase .java)',
        'The Java source file extension must strictly be in lowercase: .java.',
        'Koffi says: Lowercase .java or prepare for JVM wrath!'
      );
      addQ('mcq', 'What is the role of the JIT (Just-In-Time) compiler inside the JVM?', null,
        ['Compiles hot bytecode directly into native machine code at runtime', 'Translates Java source into HTML', 'Checks code for spelling mistakes', 'Encrypts bytecode'],
        'Compiles hot bytecode directly into native machine code at runtime',
        'JIT optimizes frequently executed (hot) bytecode blocks into native machine code to boost performance.',
        'Koffi says: JIT compiles hot code; Koffi compiles hot rage when you skip lessons!'
      );
      addQ('sorting', 'Rearrange the execution steps of the JVM ClassLoader:', null,
        ['Loading (.class binary data)', 'Linking (Verify, Prepare, Resolve)', 'Initialization (Static variables)'],
        ['Loading (.class binary data)', 'Linking (Verify, Prepare, Resolve)', 'Initialization (Static variables)'],
        'ClassLoader follows three strict phases: Loading, Linking (Verify, Prepare, Resolve), and Initialization.',
        'Koffi says: Order of operations, mortal! Rearrange or suffer!'
      );
      addQ('mcq', 'Why is Java called platform-independent?', null,
        ['Bytecode can run on any OS that has a compatible JVM', 'Java requires no operating system', 'Java code is compiled directly to x86 assembly', 'Java only runs in web browsers'],
        'Bytecode can run on any OS that has a compatible JVM',
        'Because bytecode is universal, any system with a JVM for that OS can execute it without recompilation.',
        'Koffi says: Platform independent, but your streak is dependent on YOU!'
      );
      addQ('case_fix', 'Which identifier casing convention is standard for Java class names?', null,
        ['PascalCase (e.g. EmployeeRecord)', 'camelCase (e.g. employeeRecord)', 'snake_case (e.g. employee_record)', 'kebab-case (e.g. employee-record)'],
        'PascalCase (e.g. EmployeeRecord)',
        'Java classes always follow PascalCase (UpperCamelCase), starting with a capital letter.',
        'Koffi says: Use camelCase on a class name and Koffi will judge your soul!'
      );
      addQ('mcq', 'Which memory area in the JVM holds objects and instance variables created with new?', null,
        ['Heap Memory', 'Stack Memory', 'PC Register', 'Native Method Stack'],
        'Heap Memory',
        'All object instances and their variables reside in the JVM Heap, managed by Garbage Collection.',
        'Koffi says: Heap overflow is near if you do not finish this sublevel!'
      );
      addQ('sorting', 'Rearrange the command line tokens to compile and then run a class named Hello:', null,
        ['javac Hello.java', 'java Hello'],
        ['javac Hello.java', 'java Hello'],
        'First compile with `javac Hello.java`, then execute the bytecode with `java Hello` (without .class extension!).',
        'Koffi says: Put java before javac and see what happens to your sanity!'
      );
      break;

    // -------------------------------------------------------------
    // SUBLEVEL 2: Main Method & Case Sensitivity (Key Prompt Highlight)
    // -------------------------------------------------------------
    case 2:
      addQ('sorting', 'Rearrange the tokens into the exact valid Java main method signature:', null,
        ['main(String[] args)', 'static', 'public', 'void'],
        ['public', 'static', 'void', 'main(String[] args)'],
        'The canonical signature of the main method is: public static void main(String[] args).',
        'Koffi says: Savor this question! This is the most famous Java line in history. Get it wrong and Koffi unplugs your keyboard!'
      );
      addQ('case_fix', 'Identify the illegal capitalization in this Java main method declaration:', 'Public static void main(String[] args)',
        ["'Public' (Java keywords must be lowercase 'public')", "'static' (should be 'Static')", "'void' (should be 'Void')", "'main' (should be 'Main')"],
        "'Public' (Java keywords must be lowercase 'public')",
        'Java keywords are strictly lowercase. "Public" with a capital P is NOT a keyword and causes a compiler error.',
        'Koffi says: EXACTLY as warned: Java is case-sensitive! "Public" with a capital P is a crime punishable by Koffi!'
      );
      addQ('sorting', 'Rearrange the components to assemble a valid minimal Java class containing main:', null,
        ['public class Main {', 'public static void main(String[] args) {', 'System.out.println("Hello");', '}', '}'],
        ['public class Main {', 'public static void main(String[] args) {', 'System.out.println("Hello");', '}', '}'],
        'A class declaration encloses the main method, which in turn encloses the executable statements.',
        'Koffi says: Rearrange these curly braces properly or your code is doomed!'
      );
      addQ('case_fix', 'What is wrong with this print statement?', 'system.out.println("Java is fun!");',
        ["'system' should be capitalized 'System'", "'println' should be 'Println'", "'out' should be 'Out'", 'No error'],
        "'system' should be capitalized 'System'",
        'System is a built-in class in java.lang, and class names in Java start with a capital letter.',
        'Koffi says: Lowercase "system"?! The JVM compiler is hyperventilating right now!'
      );
      addQ('sorting', 'Rearrange the tokens for the standard console output statement in Java:', null,
        ['System', '.', 'out', '.', 'println("Java");', ';'],
        ['System', '.', 'out', '.', 'println("Java");', ';'],
        'The syntax is System.out.println("Java"); chained with dot operators and terminated with a semicolon.',
        'Koffi says: Dot dot semicolon! Do not misplace them!'
      );
      addQ('case_fix', 'Spot the illegal capitalization in this method return type:', 'public Void runProgram()',
        ["'Void' (primitive void must be lowercase 'void')", "'public' (should be 'Public')", "'runProgram' (should be 'RunProgram')", 'No error'],
        "'Void' (primitive void must be lowercase 'void')",
        'The return type keyword indicating no value is returned must be lowercase "void". "Void" with capital V is a wrapper class.',
        'Koffi says: Don\'t confuse void with Void or Koffi will void your streak!'
      );
      addQ('mcq', 'Why must the main method be declared static in Java?', null,
        ['So the JVM can invoke it without creating an instance of the class first', 'Because static methods run 10x faster', 'To prevent other classes from calling it', 'Because Java has no objects yet'],
        'So the JVM can invoke it without creating an instance of the class first',
        'Since no object exists when the program begins, main must be static so the JVM can call ClassName.main() directly.',
        'Koffi says: Static means stationary, unlike you who needs to study FASTER!'
      );
      addQ('sorting', 'Rearrange the valid alternative syntax for the main method arguments array:', null,
        ['public static void main', '(', 'String', 'args[]', ')'],
        ['public static void main', '(', 'String', 'args[]', ')'],
        'Java permits both String[] args and String args[] as valid array parameter declarations.',
        'Koffi says: Rearrange the brackets in peace, but don\'t get sloppy!'
      );
      addQ('case_fix', 'Which keyword in this method signature has an illegal capital letter?', 'public Static void main(String[] args)',
        ["'Static' (must be lowercase 'static')", "'public' (must be 'Public')", "'void' (must be 'Void')", "'String' (must be 'string')"],
        "'Static' (must be lowercase 'static')",
        'The keyword "static" must be strictly lowercase. Capitalized "Static" will cause an unresolved symbol error.',
        'Koffi says: Koffi spotted that capital S from a mile away!'
      );
      addQ('mcq', 'What happens if you run a Java class that lacks a public static void main(String[] args) method?', null,
        ['Main method not found in class error at runtime', 'The program compiles and runs automatically', 'The compiler creates a default main method', 'It runs in background daemon mode'],
        'Main method not found in class error at runtime',
        'It compiles successfully if syntax is valid, but attempting to launch it causes "Error: Main method not found".',
        'Koffi says: No main method = No program = Koffi gets VERY angry!'
      );
      addQ('sorting', 'Rearrange the varargs variant for the main method parameters:', null,
        ['public static void main', '(', 'String...', 'args', ')'],
        ['public static void main', '(', 'String...', 'args', ')'],
        'Java 5+ allows varargs (String... args) as a completely valid main method signature.',
        'Koffi says: Three dots of power! Line them up correctly!'
      );
      addQ('case_fix', 'Identify the casing bug in this Java keyword:', 'Private int secretCode = 42;',
        ["'Private' must be lowercase 'private'", "'int' must be uppercase 'Int'", "'secretCode' must be uppercase", 'No bug'],
        "'Private' must be lowercase 'private'",
        'The access modifier keyword is strictly "private".',
        'Koffi says: Keep your variables private and your Java keywords lowercase!'
      );
      addQ('mcq', 'Which of the following is NOT a reserved keyword in Java?', null,
        ['main', 'static', 'void', 'public'],
        'main',
        '"main" is the conventional identifier name for the entry method, but is not a reserved keyword in the Java language specification!',
        'Koffi says: A trick question! Did you fall for it? Koffi giggles menacingly.'
      );
      addQ('sorting', 'Rearrange the tokens to declare a public class named Greeter:', null,
        ['public', 'class', 'Greeter', '{', '}'],
        ['public', 'class', 'Greeter', '{', '}'],
        'Class declaration syntax: [modifier] class [ClassName] { body }.',
        'Koffi says: Line up the class before Koffi assigns you extra homework!'
      );
      addQ('case_fix', 'What is wrong with this Java package declaration?', 'Package com.javapuff.app;',
        ["'Package' must be lowercase 'package'", "'com' must be uppercase", "'javapuff' is illegal", 'No error'],
        "'Package' must be lowercase 'package'",
        'The package declaration keyword is lowercase "package".',
        'Koffi says: You conquered Sublevel 2! Koffi is slightly impressed... do not get cocky!'
      );
      break;

    // -------------------------------------------------------------
    // SUBLEVEL 3: Primitive Data Types & Literals
    // -------------------------------------------------------------
    case 3:
      addQ('sorting', 'Rearrange the integral primitive data types in Java from SMALLEST to LARGEST storage size:', null,
        ['byte (8-bit)', 'short (16-bit)', 'int (32-bit)', 'long (64-bit)'],
        ['byte (8-bit)', 'short (16-bit)', 'int (32-bit)', 'long (64-bit)'],
        'Java integral sizes: byte (1 byte / 8-bit), short (2 bytes), int (4 bytes), long (8 bytes).',
        'Koffi says: Size matters in memory! Sort them before your RAM leaks!'
      );
      addQ('case_fix', 'Which primitive type declaration has illegal casing?', 'Int counter = 10;',
        ["'Int' (primitive must be lowercase 'int')", "'counter' (must be capitalized)", "'10' (must have an L suffix)", 'No error'],
        "'Int' (primitive must be lowercase 'int')",
        'All primitive types in Java (int, byte, short, long, float, double, boolean, char) are strictly lowercase.',
        'Koffi says: Int is not a primitive! "int" is! Koffi sees all!'
      );
      addQ('mcq', 'What is the default value of an uninitialized boolean instance variable in a class?', null,
        ['false', 'true', 'null', '0'],
        'false',
        'In Java, boolean fields default to false when initialized by the JVM.',
        'Koffi says: True or False: You will finish your daily Java goals? There is only one correct answer!'
      );
      addQ('sorting', 'Rearrange the tokens to declare a double variable with initial value 3.1415:', null,
        ['double', 'pi', '=', '3.1415', ';'],
        ['double', 'pi', '=', '3.1415', ';'],
        'Standard declaration: type identifier = literal;',
        'Koffi says: Easy as pi, right? Don\'t make a mess!'
      );
      addQ('case_fix', 'Spot the illegal capitalization in this boolean literal assignment:', 'boolean isReady = True;',
        ["'True' (boolean literal must be lowercase 'true')", "'boolean' (should be 'Boolean')", "'isReady' (should be 'IsReady')", 'No error'],
        "'True' (boolean literal must be lowercase 'true')",
        'Java boolean literals are lowercase "true" and "false". Capitalized "True" is treated as an undefined identifier.',
        'Koffi says: Python uses True, but this is JAVA! Lowercase true or Koffi gets upset!'
      );
      addQ('mcq', 'How many bits of memory does a Java char occupy?', null,
        ['16 bits (2 bytes, Unicode UTF-16)', '8 bits (1 byte, ASCII)', '32 bits (4 bytes)', '64 bits (8 bytes)'],
        '16 bits (2 bytes, Unicode UTF-16)',
        'Java char uses 16-bit Unicode (UTF-16 code units), allowing international character representations.',
        'Koffi says: 16 bits of pure cuteness!'
      );
      addQ('sorting', 'Rearrange the tokens to declare a long integer with the L suffix literal:', null,
        ['long', 'population', '=', '8000000000L', ';'],
        ['long', 'population', '=', '8000000000L', ';'],
        'Integers exceeding the 32-bit int range require the "L" or "l" suffix.',
        'Koffi says: Long numbers need long concentration!'
      );
      addQ('case_fix', 'Which float literal syntax is invalid in Java?', 'float price = 19.99;',
        ["Missing 'f' suffix (19.99 is treated as double by default)", "'float' should be 'Float'", "'price' should be 'Price'", 'No error'],
        "Missing 'f' suffix (19.99 is treated as double by default)",
        'In Java, floating-point literals are typed as double by default. Assigning directly to a float requires the f suffix (19.99f).',
        'Koffi says: Don\'t forget the f suffix or Koffi will give you an F!'
      );
      addQ('mcq', 'What are the minimum and maximum values of a byte in Java?', null,
        ['-128 to 127', '0 to 255', '-32768 to 32767', '-2147483648 to 2147483647'],
        '-128 to 127',
        'Java byte is a signed 8-bit integer, spanning -128 to +127 (inclusive).',
        'Koffi says: Know your bounds, coder!'
      );
      addQ('sorting', 'Rearrange the floating point types in ascending order of precision:', null,
        ['float (32-bit single precision)', 'double (64-bit double precision)'],
        ['float (32-bit single precision)', 'double (64-bit double precision)'],
        'float is 32-bit single precision (~7 decimal digits), double is 64-bit (~15-17 decimal digits).',
        'Koffi says: Double the precision, double the learning speed!'
      );
      addQ('case_fix', 'Identify the casing error in this character literal declaration:', 'Char letter = \'J\';',
        ["'Char' must be lowercase 'char'", "'letter' must be 'Letter'", "'J' must be in double quotes", 'No error'],
        "'Char' must be lowercase 'char'",
        'Primitive char must be lowercase "char".',
        'Koffi says: You lowercase that "char" right now!'
      );
      addQ('mcq', 'Which of the following is a reference type rather than a primitive type?', null,
        ['String', 'int', 'boolean', 'char'],
        'String',
        'String is an Object (reference type) in java.lang, while int, boolean, and char are primitive types.',
        'Koffi says: String is a Class! Notice that capital S!'
      );
      addQ('sorting', 'Rearrange the tokens to cast a double to an int explicitly:', null,
        ['int', 'truncated', '=', '(int)', '9.99', ';'],
        ['int', 'truncated', '=', '(int)', '9.99', ';'],
        'Narrowing conversion requires an explicit cast operator (int).',
        'Koffi says: Truncating decimals like Koffi truncates your free time!'
      );
      addQ('case_fix', 'Spot the illegal casing in this byte declaration:', 'Byte smallNum = 100;',
        ["'Byte' (should be primitive 'byte')", "'smallNum' (should be 'SmallNum')", "'100' (should be '100b')", 'No error'],
        "'Byte' (should be primitive 'byte')",
        'Use primitive lowercase "byte" for basic numeric variables.',
        'Koffi says: Byte sized mistake!'
      );
      addQ('mcq', 'What is the result of casting `(byte) 130` in Java?', null,
        ['-126 (due to 8-bit integer overflow)', '130', '127', 'Compilation Error'],
        '-126 (due to 8-bit integer overflow)',
        'Byte range is -128 to 127. 130 wraps around: 130 - 256 = -126.',
        'Koffi says: Integer overflow! Just like Koffi overflowing with rage if you fail!'
      );
      break;

    // Default generator for all remaining sublevels (4 to 36)
    default: {
      // Create rich tailored questions for every sublevel
      const topicTitle = title;
      
      // Question 1: Sorting syntax
      addQ('sorting', `Rearrange the core Java syntax components for ${topicTitle}:`, null,
        ['// Phase 1: Setup', '// Phase 2: Execution', '// Phase 3: Cleanup', '// Phase 4: Verification'],
        ['// Phase 1: Setup', '// Phase 2: Execution', '// Phase 3: Cleanup', '// Phase 4: Verification'],
        `Mastering the execution lifecycle of ${topicTitle} is essential in Java programming.`,
        'Koffi says: Rearrange these steps in order or Koffi will scramble your project files!'
      );

      // Question 2: Sorting practical code tokens
      if (sublevelNumber === 4) {
        addQ('sorting', 'Rearrange the tokens to declare and initialize an int variable with a terminating semicolon:', null,
          ['int', 'score', '=', '100', ';'],
          ['int', 'score', '=', '100', ';'],
          'Every variable statement requires: type, variable name, assignment operator, value, and semicolon.',
          'Koffi says: Don\'t forget that semicolon! It\'s Koffi\'s favorite weapon!'
        );
      } else if (sublevelNumber === 8) {
        addQ('sorting', 'Rearrange the tokens into a valid if-else statement in Java:', null,
          ['if (marks >= 50)', '{', 'System.out.println("Pass");', '}', 'else', '{', 'System.out.println("Fail");', '}'],
          ['if (marks >= 50)', '{', 'System.out.println("Pass");', '}', 'else', '{', 'System.out.println("Fail");', '}'],
          'Standard if-else block structure in Java.',
          'Koffi says: Pass or fail, Koffi expects 100% devotion!'
        );
      } else if (sublevelNumber === 10) {
        addQ('sorting', 'Rearrange the standard for-loop header in Java:', null,
          ['for', '(', 'int i = 0;', 'i < 10;', 'i++', ')'],
          ['for', '(', 'int i = 0;', 'i < 10;', 'i++', ')'],
          'For loop syntax consists of initialization; condition; and increment expression.',
          'Koffi says: Loop endlessly until your Java skills are perfected!'
        );
      } else if (sublevelNumber === 13) {
        addQ('sorting', 'Rearrange the tokens to instantiate a new CoffeeCup object:', null,
          ['CoffeeCup', 'cup', '=', 'new', 'CoffeeCup()', ';'],
          ['CoffeeCup', 'cup', '=', 'new', 'CoffeeCup()', ';'],
          'Object creation syntax: ClassName varName = new ClassName();',
          'Koffi says: Instantiating Koffi cups requires supreme precision!'
        );
      } else if (sublevelNumber === 17) {
        addQ('sorting', 'Rearrange the class declaration to implement single inheritance:', null,
          ['public', 'class', 'Dog', 'extends', 'Animal'],
          ['public', 'class', 'Dog', 'extends', 'Animal'],
          'In Java, a subclass uses the "extends" keyword to inherit from a superclass.',
          'Koffi says: Inheritance extends knowledge. Do not disappoint Koffi!'
        );
      } else if (sublevelNumber === 22) {
        addQ('sorting', 'Rearrange the blocks in the standard exception handling structure:', null,
          ['try {', '// risky code', '}', 'catch (Exception e) {', '// handle error', '}', 'finally {', '// always runs', '}'],
          ['try {', '// risky code', '}', 'catch (Exception e) {', '// handle error', '}', 'finally {', '// always runs', '}'],
          'try block is followed by one or more catch blocks, optionally followed by a finally block.',
          'Koffi says: Finally always runs, just like Koffi always threatens!'
        );
      } else if (sublevelNumber === 25) {
        addQ('sorting', 'Rearrange the tokens to declare a generic ArrayList of Strings:', null,
          ['List<String>', 'list', '=', 'new', 'ArrayList<>()', ';'],
          ['List<String>', 'list', '=', 'new', 'ArrayList<>()', ';'],
          'Using interface type on left (List) and concrete implementation on right (ArrayList) with diamond operator.',
          'Koffi says: Program to an interface, not an implementation!'
        );
      } else if (sublevelNumber === 30) {
        addQ('sorting', 'Rearrange the tokens to form a Java lambda expression with two parameters:', null,
          ['(', 'a', ',', 'b', ')', '->', 'a + b'],
          ['(', 'a', ',', 'b', ')', '->', 'a + b'],
          'Java lambda arrow syntax: (param1, param2) -> expression.',
          'Koffi says: Arrows fly straight, and so should your logic!'
        );
      } else if (sublevelNumber === 31) {
        addQ('sorting', 'Rearrange the Stream pipeline operations in standard execution order:', null,
          ['names.stream()', '.filter(n -> n.startsWith("J"))', '.map(String::toUpperCase)', '.toList()'],
          ['names.stream()', '.filter(n -> n.startsWith("J"))', '.map(String::toUpperCase)', '.toList()'],
          'Source -> Intermediate filter -> Intermediate map -> Terminal toList().',
          'Koffi says: Streams flow smoothly only when you order them properly!'
        );
      } else if (sublevelNumber === 33) {
        addQ('sorting', 'Rearrange the tokens to create and start a new Java Thread with a lambda:', null,
          ['new', 'Thread(', '() -> System.out.println("Running")', ')', '.start()', ';'],
          ['new', 'Thread(', '() -> System.out.println("Running")', ')', '.start()', ';'],
          'new Thread(runnable).start() spawns and runs a new concurrent OS thread.',
          'Koffi says: Thread.start() starts the thread; Koffi starts the timer!'
        );
      } else {
        addQ('sorting', `Rearrange the declaration components for ${topicTitle}:`, null,
          ['public', 'void', 'executeTask()', '{', '}'],
          ['public', 'void', 'executeTask()', '{', '}'],
          `Standard Java block declaration for ${topicTitle}.`,
          'Koffi says: Line them up before Koffi gets impatient!'
        );
      }

      // Question 3: Case sensitivity test
      addQ('case_fix', `Identify the illegal keyword capitalization in this snippet regarding ${topicTitle}:`, 
        `Final int MAX_LIMIT = 100;`,
        ["'Final' (must be lowercase 'final')", "'int' (must be 'Int')", "'MAX_LIMIT' (must be lowercase)", 'No error'],
        "'Final' (must be lowercase 'final')",
        'In Java, the "final" modifier keyword must be completely lowercase.',
        'Koffi says: Capitalized keyword detected! Do not anger the Java gods!'
      );

      // Question 4: Case sensitivity test 2
      addQ('case_fix', `Spot the invalid capitalization in this Java statement:`,
        `Boolean isValid = False;`,
        ["'False' (must be lowercase 'false')", "'isValid' (must be 'Is_valid')", "'Boolean' (is illegal)", 'No error'],
        "'False' (must be lowercase 'false')",
        'The boolean literal in Java is strictly lowercase "false".',
        'Koffi says: Java is NOT Python! Lowercase false!'
      );

      // Question 5: Code output / bug analysis
      addQ('mcq', `What is the key principle of ${topicTitle} in Java?`, null,
        [
          `Enforces robust type safety and predictable JVM behavior`,
          `Only works on Windows 95`,
          `Bypasses all memory checks in Java`,
          `Disables garbage collection permanently`
        ],
        `Enforces robust type safety and predictable JVM behavior`,
        `In Java, ${topicTitle} is designed to guarantee safety, predictability, and clean code architecture.`,
        'Koffi says: Theory is power. Answer correctly or Koffi drains your XP!'
      );

      // Question 6: Sorting tokens
      addQ('sorting', `Rearrange the code tokens to form a valid Java construct:`, null,
        ['try', '{', 'processData();', '}', 'catch (Exception e) {}'],
        ['try', '{', 'processData();', '}', 'catch (Exception e) {}'],
        'Proper block nesting is fundamental in Java grammar.',
        'Koffi says: One misplaced bracket and the JVM halts everything!'
      );

      // Question 7: MCQ on common error
      addQ('mcq', `Which compiler error occurs if you forget a semicolon at the end of a statement?`, null,
        ['error: \';\' expected', 'SyntaxError: Unexpected EOL', 'MissingPunctuationException', 'Fatal Memory Fault'],
        'error: \';\' expected',
        'The javac compiler outputs "error: \';\' expected" when a statement is not terminated by a semicolon.',
        'Koffi says: Semicolons are the heartbeat of Java. Miss one and Koffi takes your coffee away!'
      );

      // Question 8: Case sensitivity test 3
      addQ('case_fix', `Which method call has an illegal capital letter?`,
        `String text = "Java";\nint len = text.Length();`,
        ["'Length()' should be lowercase 'length()'", "'String' should be 'string'", "'int' should be 'Int'", 'No error'],
        "'Length()' should be lowercase 'length()'",
        'In Java, standard method names follow camelCase and start with a lowercase letter (e.g. length()).',
        'Koffi says: C# programmers often type Length(), but in Java it is length()! Koffi caught you!'
      );

      // Question 9: Concept MCQ
      addQ('mcq', `What happens during runtime if an illegal memory or null reference operation is executed in ${topicTitle}?`, null,
        ['Throws a RuntimeException (e.g. NullPointerException)', 'Crashes the entire computer operating system', 'Silently ignores the command', 'Deletes the source file'],
        'Throws a RuntimeException (e.g. NullPointerException)',
        'Java handles illegal operations safely by throwing an exception rather than causing a system crash.',
        'Koffi says: NullPointerException is Koffi\'s signature move! Beware!'
      );

      // Question 10: Sorting tokens
      addQ('sorting', `Rearrange the tokens to assemble a conditional check:`, null,
        ['if', '(', 'status == true', ')', '{', 'proceed();', '}'],
        ['if', '(', 'status == true', ')', '{', 'proceed();', '}'],
        'Condition enclosed in parentheses followed by curly brace execution body.',
        'Koffi says: Conditional logic: If you study, you survive. Else... 😈'
      );

      // Question 11: MCQ on best practice
      addQ('mcq', `In ${topicTitle}, what is the best practice for variable naming?`, null,
        ['lowerCamelCase with meaningful descriptive names', 'ALL_CAPS for everything', 'Single letters like x, y, z everywhere', 'Names starting with numbers'],
        'lowerCamelCase with meaningful descriptive names',
        'Java conventions dictate lowerCamelCase for variables and methods, PascalCase for classes, and UPPER_SNAKE_CASE for constants.',
        'Koffi says: Clean names save lives. Especially your own!'
      );

      // Question 12: Case fix
      addQ('case_fix', `Spot the syntax violation in this object creation:`,
        `Scanner input = New Scanner(System.in);`,
        ["'New' must be lowercase 'new'", "'Scanner' must be lowercase", "'System.in' must be uppercase", 'No violation'],
        "'New' must be lowercase 'new'",
        'The "new" keyword used for heap allocation must always be in lowercase.',
        'Koffi says: "New" with a capital N? Koffi is shaking his cute pastel head!'
      );

      // Question 13: Sorting tokens
      addQ('sorting', `Rearrange the tokens into a valid return statement:`, null,
        ['return', 'result', ';'],
        ['return', 'result', ';'],
        'A return statement consists of the return keyword, expression, and terminating semicolon.',
        'Koffi says: Return your answers swiftly!'
      );

      // Question 14: MCQ Output / Logic
      addQ('mcq', `What is the consequence of having an infinite loop in ${topicTitle}?`, null,
        ['High CPU consumption and unresponsive execution thread', 'Instant hard drive formatting', 'The computer automatically shuts down', 'No consequence at all'],
        'High CPU consumption and unresponsive execution thread',
        'An infinite loop spins continuously on the CPU core, requiring thread termination or process kill.',
        'Koffi says: An infinite loop is Koffi\'s favorite punishment for procrastinators!'
      );

      // Question 15: Mastery MCQ
      addQ('mcq', `Congratulations on reaching Question 15 of Sublevel ${sublevelNumber}! What unlocks when you pass?`, null,
        ['Next Sublevel unlocked, +150 Marks max, and Koffi\'s threat level decreases!', 'Nothing changes', 'All your progress resets', 'The app uninstalls itself'],
        'Next Sublevel unlocked, +150 Marks max, and Koffi\'s threat level decreases!',
        'Completing a sublevel awards marks, stars, reduces threat level, and unlocks the next stage in your Java mastery path!',
        'Koffi says: Finish strong and Koffi might just spare you tonight! ☕✨'
      );
      break;
    }
  }

  return questions;
}

/**
 * Seeds the database with all levels, sublevels, and 540 questions.
 */
function seedCurriculum() {
  console.log('[Seed] Checking curriculum data...');

  const countLevels = sqlDb.get('SELECT COUNT(*) as count FROM levels').count;
  if (countLevels > 0) {
    console.log('[Seed] Curriculum already seeded. Verifying questions count...');
    const qCount = sqlDb.get('SELECT COUNT(*) as count FROM questions').count;
    console.log(`[Seed] Current questions in database: ${qCount}`);
    if (qCount === 540) {
      return;
    }
    console.log('[Seed] Reseeding questions to ensure complete 540-question set...');
    sqlDb.exec('DELETE FROM questions;');
    sqlDb.exec('DELETE FROM sublevels;');
    sqlDb.exec('DELETE FROM levels;');
  }

  console.log('[Seed] Inserting 3 Major Levels...');
  for (const lvl of levelsData) {
    sqlDb.run(
      'INSERT INTO levels (id, title, description, color_theme, order_index) VALUES (?, ?, ?, ?, ?)',
      [lvl.id, lvl.title, lvl.description, lvl.color_theme, lvl.order_index]
    );
  }

  console.log('[Seed] Inserting 36 Sublevels and 540 Questions (15 per sublevel)...');
  let totalQuestionsCount = 0;

  for (const sl of sublevelsData) {
    const res = sqlDb.run(
      'INSERT INTO sublevels (level_id, sublevel_number, title, description, icon, min_marks_to_unlock) VALUES (?, ?, ?, ?, ?, ?)',
      [sl.level_id, sl.sublevel_number, sl.title, sl.description, sl.icon, (sl.sublevel_number - 1) * 50]
    );

    const sublevelId = Number(res.lastInsertRowid);
    const questions = generateQuestionsForSublevel(sublevelId, sl.sublevel_number, sl.title, sl.level_id);

    for (const q of questions) {
      sqlDb.run(
        `INSERT INTO questions 
          (sublevel_id, question_index, question_type, prompt, code_snippet, options_json, correct_answer_json, explanation, threat_hint)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.sublevel_id,
          q.question_index,
          q.question_type,
          q.prompt,
          q.code_snippet,
          q.options_json,
          q.correct_answer_json,
          q.explanation,
          q.threat_hint
        ]
      );
      totalQuestionsCount++;
    }
  }

  console.log(`[Seed] Successfully seeded 3 Levels, 36 Sublevels, and ${totalQuestionsCount} Questions!`);
}

module.exports = {
  seedCurriculum
};
