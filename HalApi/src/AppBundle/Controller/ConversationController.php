<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class ConversationController extends Controller
{
    /**
     * @Route("/conversation")
     */
    public function conversationPostAction()
    {
        return $this->render('AppBundle:ConversationController:conversation_post.html.twig', array(
            // ...
        ));
    }

    /**
     * @Route("/conversation/{id}")
     */
    public function conversationGetAction($id)
    {
        return $this->render('AppBundle:ConversationController:conversation_get.html.twig', array(
            // ...
        ));
    }

    /**
     * @Route("/conversation-tree/{id}")
     */
    public function conversationTreeGetAction($id)
    {
        return $this->render('AppBundle:ConversationController:conversation_tree_get.html.twig', array(
            // ...
        ));
    }

    /**
     * @Route("/conversation/{id}")
     */
    public function conversationPatchAction($id)
    {
        return $this->render('AppBundle:ConversationController:conversation_patch.html.twig', array(
            // ...
        ));
    }

}
