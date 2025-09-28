package com.bruno.restapi.exception;

public class ProfessorNaoEncontradoException extends Exception {

    private static final long serialVersionUID = 1L;

    private int codigo;

    public ProfessorNaoEncontradoException(String msg) {
        super(msg);
    }

    public ProfessorNaoEncontradoException(int codigo, String msg) {
        super(msg);
        this.codigo = codigo;
    }

    public int getCodigoDeErro() {
        return codigo;
    }
}